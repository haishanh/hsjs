'use strict';

const markdown = require('..');

describe('model', () => {
  it('empty string', () => {
    const input = '';
    const ret = markdown.render(input);
    expect(ret).toMatchSnapshot();
  });

  it('all space string', () => {
    const input = '    ';
    const ret = markdown.render(input);
    expect(ret).toMatchSnapshot();
  });

  it('simple string', () => {
    const input = 'hello';
    const ret = markdown.render(input);
    expect(ret).toMatchSnapshot();
  });

  it('headings', () => {
    const input = `
# one

## two0

### three0

## two1

### three1
    `;
    const ret = markdown.render(input);
    expect(ret).toMatchSnapshot();
  });

  it('highlight', () => {
    const input = `
# one

` + '```js\nconsole.log("test")\n```\n' + `
## two
`;
    const ret = markdown.render(input);
    expect(ret).toMatchSnapshot();
  });
});
