import {matchTopic} from '../src/matchTopic';

describe('/test/matchTopic.test.ts', () => {
  it('topic method test', async () => {
    expect(matchTopic('test/test', 'test/test')).toBe(true)

    expect(matchTopic('test/test/test', 'test/test')).toBe(false)
    expect(matchTopic('test/test/test', 'test/test')).toBe(false)
    expect(matchTopic('test/test/test/test', 'test/test')).toBe(false)
    expect(matchTopic('test/test', 'test/test/test')).toBe(false)
    expect(matchTopic('test/test', 'test/test/test/test')).toBe(false)

    expect(matchTopic('test/test', '')).toBe(false)
    expect(matchTopic('', 'test/test')).toBe(false)
  })

  it('topic wildcard:( + ) method test', async () => {
    expect(matchTopic('test/test/test', 'test/test/+')).toBe(true)
    expect(matchTopic('test/test/test/test', 'test/test/+/+')).toBe(true)
    expect(matchTopic('test/test/+', 'test/test/test')).toBe(true)
    expect(matchTopic('test/test/+/+', 'test/test/test/test')).toBe(true)

    expect(matchTopic('test/test', 'test/test/+')).toBe(false)
    expect(matchTopic('test/test/test', 'test/test/+/+')).toBe(false)
    expect(matchTopic('test/test/+/test', 'test/test/test')).toBe(false)
    expect(matchTopic('test/test/+/+', 'test/test/test/test/test')).toBe(false)
  })

  it('topic wildcard:( # )method test', async () => {
    expect(matchTopic('test/#', 'test/test/test')).toBe(true)
    expect(matchTopic('test/#', 'test/test')).toBe(true)
  
    expect(matchTopic('test/+/#', 'test/test')).toBe(false)
    expect(matchTopic('test/+/#', 'test/test/test')).toBe(true)
  })

  it('topic wildcard:( $share )method test', async () => {
    expect(matchTopic('$share/groupA/a/b', 'a/b')).toBe(true)

    expect(matchTopic('$share/groupA/a/+/c', 'a/b1/c')).toBe(true)
    expect(matchTopic('$share/groupA/a/+/c', 'a/b2/c')).toBe(true)

    expect(matchTopic('$share/groupA/a/+/c/#', 'a/b1/c/d/e/f')).toBe(true)
    expect(matchTopic('$share/groupA/a/+/c/#', 'a/b2/c/d/e/f')).toBe(true)


    expect(matchTopic('$share/groupA/a/b/c', '/a/b/c')).toBe(false)
    expect(matchTopic('$share/groupA/a/b/c', 'groupA/a/b/c')).toBe(false)

  })

  it('topic wildcard:( $queue )method test', async () => {
    expect(matchTopic('$queue/a/b', 'a/b')).toBe(true)

    expect(matchTopic('$queue/a/+/c', 'a/b1/c')).toBe(true)
    expect(matchTopic('$queue/a/+/c', 'a/b2/c')).toBe(true)

    expect(matchTopic('$queue/a/+/c/#', 'a/b1/c/d/e/f')).toBe(true)
    expect(matchTopic('$queue/a/+/c/#', 'a/b2/c/d/e/f')).toBe(true)


    expect(matchTopic('$queue/a/b/c', '/a/b/c')).toBe(false)
    expect(matchTopic('$queue/a/b/c', 'groupA/a/b/c')).toBe(false)
  })
})