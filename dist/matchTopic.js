"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchTopic = void 0;
const memoize = require("memoizee");
const removeWildcard = (topic) => {
    const ShareRegExp = /^\$share\/(\w){1,}\/((\w){1,}|\+{1})/i;
    const ShareReplaceExp = /^\$share\/(\w){1,}\//i;
    const QueueRegExp = /^\$queue\/(\w){1}|(\+){1}/i;
    const QueueReplaceExp = /^\$queue\//i;
    let result = '';
    if (ShareRegExp.test(topic)) {
        result = topic.replace(ShareReplaceExp, '');
    }
    else if (QueueRegExp.test(topic)) {
        result = topic.replace(QueueReplaceExp, '');
    }
    return result || topic;
};
const matchTopic = (filter, topic) => {
    if (filter === topic)
        return true;
    const filterArray = removeWildcard(filter).split('/');
    const topicArray = removeWildcard(topic).split('/');
    const filterLen = filterArray.length;
    const topicLen = topicArray.length;
    const checkLength = filterLen > topicLen ? filterLen : topicLen;
    if (!filterLen || !topicLen)
        return false;
    for (let i = 0; i < checkLength; ++i) {
        const left = filterArray[i];
        const right = topicArray[i];
        if ((left === '+' && right) || (right === '+' && left)) {
            continue;
        }
        if ((left === '#' && right) || (left && right === '#')) {
            return true;
        }
        if (left !== right)
            return false;
    }
    return true;
};
exports.matchTopic = matchTopic;
exports.default = memoize(exports.matchTopic, {
    primitive: true,
    max: 128,
});
