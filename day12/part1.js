const fs = require('fs');
const path_ = require('path');

const input = fs.readFileSync(path_.resolve(__dirname, 'input.txt'), 'utf8');

const edges = input.split('\n').map(line => {
    const [start, end] = line.trim().split('-');
    return { start, end };
});

const nodes = edges.reduce((nodes, edge) => {
    const { start, end } = edge;
    if (!nodes[start]) {
        nodes[start] = { name: start, neighbors: [] };
    }
    if (!nodes[end]) {
        nodes[end] = { name: end, neighbors: [] };
    }

    nodes[start].neighbors.push(end);
    nodes[end].neighbors.push(start);

    return nodes;
}, {});

const graph = { edges, nodes };

function findPaths(graph, from, to, path = [from]) {
    if (from === to) {
        return [path];
    }

    const nextNodes = graph.nodes[from].neighbors.filter(
        neighbor =>
            neighbor.toUpperCase() === neighbor ||
            path.every(other => other !== neighbor)
    );

    const paths = nextNodes.reduce(
        (paths, nextNode) => [
            ...paths,
            ...findPaths(graph, nextNode, to, [...path, nextNode])
        ],
        []
    );

    return paths;
}

const paths = findPaths(graph, 'start', 'end');

const answer = paths.length;
console.log(`Answer: ${answer}`);