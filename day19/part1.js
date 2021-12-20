const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

// const input = `--- scanner 0 ---
// 404,-588,-901
// 528,-643,409
// -838,591,734
// 390,-675,-793
// -537,-823,-458
// -485,-357,347
// -345,-311,381
// -661,-816,-575
// -876,649,763
// -618,-824,-621
// 553,345,-567
// 474,580,667
// -447,-329,318
// -584,868,-557
// 544,-627,-890
// 564,392,-477
// 455,729,728
// -892,524,684
// -689,845,-530
// 423,-701,434
// 7,-33,-71
// 630,319,-379
// 443,580,662
// -789,900,-551
// 459,-707,401

// --- scanner 1 ---
// 686,422,578
// 605,423,415
// 515,917,-361
// -336,658,858
// 95,138,22
// -476,619,847
// -340,-569,-846
// 567,-361,727
// -460,603,-452
// 669,-402,600
// 729,430,532
// -500,-761,534
// -322,571,750
// -466,-666,-811
// -429,-592,574
// -355,545,-477
// 703,-491,-529
// -328,-685,520
// 413,935,-424
// -391,539,-444
// 586,-435,557
// -364,-763,-893
// 807,-499,-711
// 755,-354,-619
// 553,889,-390

// --- scanner 2 ---
// 649,640,665
// 682,-795,504
// -784,533,-524
// -644,584,-595
// -588,-843,648
// -30,6,44
// -674,560,763
// 500,723,-460
// 609,671,-379
// -555,-800,653
// -675,-892,-343
// 697,-426,-610
// 578,704,681
// 493,664,-388
// -671,-858,530
// -667,343,800
// 571,-461,-707
// -138,-166,112
// -889,563,-600
// 646,-828,498
// 640,759,510
// -630,509,768
// -681,-892,-333
// 673,-379,-804
// -742,-814,-386
// 577,-820,562

// --- scanner 3 ---
// -589,542,597
// 605,-692,669
// -500,565,-823
// -660,373,557
// -458,-679,-417
// -488,449,543
// -626,468,-788
// 338,-750,-386
// 528,-832,-391
// 562,-778,733
// -938,-730,414
// 543,643,-506
// -524,371,-870
// 407,773,750
// -104,29,83
// 378,-903,-323
// -778,-728,485
// 426,699,580
// -438,-605,-362
// -469,-447,-387
// 509,732,623
// 647,635,-688
// -868,-804,481
// 614,-800,639
// 595,780,-596

// --- scanner 4 ---
// 727,592,562
// -293,-554,779
// 441,611,-461
// -714,465,-776
// -743,427,-804
// -660,-479,-426
// 832,-632,460
// 927,-485,-438
// 408,393,-506
// 466,436,-512
// 110,16,151
// -258,-428,682
// -393,719,612
// -211,-452,876
// 808,-476,-593
// -575,615,604
// -485,667,467
// -680,325,-822
// -627,-443,-432
// 872,-547,-609
// 833,512,582
// 807,604,487
// 839,-516,451
// 891,-625,532
// -652,-548,-490
// 30,-46,-14`;

const scanners = input.split('\n\n').map(
    scannerInput => scannerInput
        .trim()
        .split('\n')
        .slice(1)
        .map(
            beaconInput => beaconInput.trim().split(',').map(Number)
        ));

console.log(scanners.length);

const subtract = (a, b) => a.map((coordinate, index) => coordinate - b[index]);

const equals = (a, b) => a.every((_, index) => a[index] === b[index]);

const turn = (matrix) => matrix.map(([x, y, z]) => [-y, x, z]);
const roll = (matrix) => matrix.map(([x, y, z]) => [x, z, -y]);

const rotationSequence = [
    roll,
    turn,
    turn,
    turn,
    roll,
    turn,
    turn,
    turn,
    roll,
    turn,
    turn,
    turn,
    (matrix) => roll(turn(roll(matrix))),
    roll,
    turn,
    turn,
    turn,
    roll,
    turn,
    turn,
    turn,
    roll,
    turn,
    turn,
];

const overlay = (a, b) => [
    ...a,
    ...b.filter(
        beaconB => a.every(beaconA => !equals(beaconA, beaconB))
    )
];

const alignTo = (to, scanner) => {

    const rotations = rotationSequence.reduce(
        (matrixes, action) => [
            ...matrixes,
            action(matrixes[matrixes.length - 1])
        ],
        [scanner]
    );

    const transformations = rotations.reduce(
        (transformations, rotation) => to.reduce(
            (transformations, toBeacon) =>
                rotation.reduce(
                    (translations, fromBeacon) => [
                        ...translations,
                        rotation.reduce(
                            (translation, beacon) => [
                                ...translation,
                                subtract(beacon, subtract(fromBeacon, toBeacon))
                            ],
                            []
                        )
                    ],
                    transformations
                ),
            transformations
        ),
        []
    );

    const sparseTo = to.reduce((quickTo, position) => {
        quickTo[JSON.stringify(position)] = true;
        return quickTo;
    }, {});

    const transformation = transformations.find(transformation => {
        let count = 0;
        for (let i = 0; i < transformation.length; i++) {
            const position = transformation[i];
            if (sparseTo[JSON.stringify(position)]) {
                count++;
            }
            if (count >= 12) {
                return true;
            }
        }
        return false;
        // const overlappingBeacons = transformation.filter((position) => sparseTo[JSON.stringify(position)]);
        // return overlappingBeacons.length >= 12;
    });

    return transformation;
};

const aligned = scanners.slice(0, 1);
const toAlign = scanners.slice(1);
for (let i = 0; i < toAlign.length; i++) {
    const scanner = toAlign[i];
    const match = aligned.reduce(
        (match, other) => match ?? alignTo(other, scanner),
        null
    );
    if (match) {
        toAlign.splice(i, 1);
        aligned.push(match);
        i = -1;
    }
}
console.log("TO", toAlign.length);

const overlayed = aligned.reduce(overlay);
overlayed
    .sort((a, b) => a[2] > b[2] ? 1 : -1)
    .sort((a, b) => a[1] > b[1] ? 1 : -1)
    .sort((a, b) => a[0] > b[0] ? 1 : -1);

const overlap = (a, b) => a.filter(beaconA => b.some(beaconB => equals(beaconA, beaconB)));
console.log("O", overlap(aligned[0], aligned[1]).length);

console.log("A", aligned);
console.log("--", overlayed.length);