const fs = require('fs');
const path_ = require('path');

const input = fs.readFileSync(path_.resolve(__dirname, 'input.txt'), 'utf8');

const hexToBinary = (hex) => hex.split('').map(char => ({
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    "A": "1010",
    "B": "1011",
    "C": "1100",
    "D": "1101",
    "E": "1110",
    "F": "1111"
})[char]).join('');

class PacketReader {

    position = 0;
    data;

    constructor(binaryData) {
        this.data = binaryData;
    }

    readBits(count) {
        const bits = this.data.slice(this.position, this.position + count);
        this.position += count;
        return bits;
    }

    hasNext() {
        return position < this.data.length;
    }

    peek(count = 1) {
        return this.data.slice(this.position, this.position + count);
    }

    readPacket() {
        const version = parseInt(this.readBits(3), 2);
        const typeId = parseInt(this.readBits(3), 2);
        let packet;
        switch (typeId) {
            case 4:
                packet = this.readLiteral();
                break;
            default:
                packet = this.readOperator();
                break;
        }
        return {
            version,
            typeId,
            ...packet
        };
    }

    readLiteral() {
        const value = [];

        let hasNext = true;
        while (this.position < this.data.length && hasNext) {
            const data = this.readBits(5);
            value.push(data.slice(1, 5));
            hasNext = data[0] === '1';
        }

        return { value: parseInt(value.join(''), 2) };
    }

    readOperator() {
        const lengthTypeId = parseInt(this.readBits(1), 2);
        const subPackets = [];
        if (lengthTypeId === 0) {
            const totalLength = parseInt(this.readBits(15), 2);
            const startPosition = this.position;
            do {
                subPackets.push(this.readPacket());
            } while (this.position < startPosition + totalLength);
        } else {
            const packetCount = parseInt(this.readBits(11), 2);
            for (let i = 0; i < packetCount; i++) {
                subPackets.push(this.readPacket());
            }
        }
        return { subPackets };
    }
};

const evaluatePacket = (packet) => {
    switch (packet.typeId) {
        case 0:
            return packet.subPackets.reduce((sum, packet) => sum + evaluatePacket(packet), 0);
        case 1:
            return packet.subPackets.reduce((product, packet) => product * evaluatePacket(packet), 1);
        case 2:
            return packet.subPackets.reduce((min, packet) => Math.min(min, evaluatePacket(packet)), Infinity);
        case 3:
            return packet.subPackets.reduce((max, packet) => Math.max(max, evaluatePacket(packet)), -Infinity);
        case 4:
            return packet.value;
        case 5:
            return evaluatePacket(packet.subPackets[0]) > evaluatePacket(packet.subPackets[1]) ? 1 : 0;
        case 6:
            return evaluatePacket(packet.subPackets[0]) < evaluatePacket(packet.subPackets[1]) ? 1 : 0;
        case 7:
            return evaluatePacket(packet.subPackets[0]) === evaluatePacket(packet.subPackets[1]) ? 1 : 0;

    }
};

const sumVersion = (packet) => {
    const subPacketsSum =
        packet.subPackets?.reduce(
            (sum, packet) => sum + sumVersion(packet),
            0
        ) ?? 0;
    return packet.version + subPacketsSum;
};

const binaryInput = hexToBinary(input);
const reader = new PacketReader(binaryInput);
const packet = reader.readPacket();

const answerPart1 = sumVersion(packet);
const answerPart2 = evaluatePacket(packet);
console.log(`Answer Part 1: ${answerPart1}`);
console.log(`Answer Part 2: ${answerPart2}`);