import 'should';
import 'should-sinon';
import { FileMessage } from '../src/';
import { File } from 'avoscloud-sdk';

describe('FileMessage', () => {
  it('param check', () => {
    (() => new FileMessage('1')).should.throw();
  });
  it('file created with content', () => {
    const FILE_NAME = 'FileMessage_test.txt';
    const file = new File(FILE_NAME, {
      base64: 'd29ya2luZyBhdCBhdm9zY2xvdWQgaXMgZ3JlYXQh',
    });
    file.metaData('foo', 'bar');
    (() => new FileMessage(file)).should.throw();
    return file.save().then(() => new FileMessage(file)).then(message => {
      message.setText('chrome');
      message.setAttributes({ version: 31 });
      message.getFile().should.be.exactly(file);
      const json = message.toJSON();
      json.should.containDeep({
        _lctype: -6,
        _lctext: 'chrome',
        _lcattrs: { version: 31 },
        _lcfile: {
          url: file.url(),
          objId: file.id,
          metaData: {
            name: FILE_NAME,
            foo: 'bar',
          },
        },
      });
      return FileMessage.parse(json);
    }).then(message => {
      message.text.should.eql('chrome');
      message.attributes.should.eql({ version: 31 });
      const fileCopy = message.getFile();
      fileCopy.should.not.be.exactly(file);
      fileCopy.name().should.eql(FILE_NAME);
      fileCopy.id.should.eql(file.id);
      fileCopy.url().should.eql(file.url());
      fileCopy.metaData().should.eql(file.metaData());
    });
  });
  it('file created from url', () => {
    const FILE_NAME = 'favicon.ico';
    const FILE_URL = 'https://leancloud.cn/favicon.ico';
    const file = File.withURL(FILE_NAME, FILE_URL);
    file.metaData('foo', 'bar');
    (() => new FileMessage(file)).should.throw();
    return file.save().then(() => new FileMessage(file)).then(message => {
      message.setText('chrome');
      message.setAttributes({ version: 31 });
      message.getFile().should.be.exactly(file);
      const json = message.toJSON();
      json.should.containDeep({
        _lctype: -6,
        _lctext: 'chrome',
        _lcattrs: { version: 31 },
        _lcfile: {
          url: file.url(),
          objId: file.id,
          metaData: {
            name: FILE_NAME,
            foo: 'bar',
          },
        },
      });
      return FileMessage.parse(json);
    }).then(message => {
      message.text.should.eql('chrome');
      message.attributes.should.eql({ version: 31 });
      const fileCopy = message.getFile();
      fileCopy.should.not.be.exactly(file);
      fileCopy.name().should.eql(FILE_NAME);
      fileCopy.id.should.eql(file.id);
      fileCopy.url().should.eql(file.url());
      fileCopy.metaData().should.eql(file.metaData());
    });
  });
});
