import 'should';
import 'should-sinon';
import {
  FileMessage,
  ImageMessage,
  AudioMessage,
  VideoMessage,
} from '../src/';
import { File } from 'leancloud-storage';

describe('FileMessage and subclasses', () => {
  let file;
  const FILE_NAME = 'favicon.ico';
  const FILE_URL = 'https://leancloud.cn/favicon.ico';
  before(() => {
    file = File.withURL(FILE_NAME, FILE_URL);
    file.metaData('foo', 'bar');
    return file.save();
  });

  describe('FileMessage', () => {
    it('param check', () => {
      (() => new FileMessage('1')).should.throw();
    });
    it('file created with content', () => {
      const FILE_NAME_1 = 'FileMessage_test.txt';
      const file1 = new File(FILE_NAME_1, {
        base64: 'd29ya2luZyBhdCBhdm9zY2xvdWQgaXMgZ3JlYXQh',
      });
      file1.metaData('foo', 'bar');
      (() => new FileMessage(file1)).should.throw();
      return file1.save()
        .then(() => new FileMessage(file1))
        .then(message => {
          message.setText('chrome');
          message.setAttributes({ version: 31 });
          message.getFile().should.be.exactly(file1);
          const json = message.toJSON();
          json.should.containDeep({
            _lctype: -6,
            _lctext: 'chrome',
            _lcattrs: { version: 31 },
            _lcfile: {
              url: file1.url(),
              objId: file1.id,
              metaData: {
                name: FILE_NAME_1,
                foo: 'bar',
              },
            },
          });
          return FileMessage.parse(json);
        })
        .then(message => {
          message.should.be.instanceof(FileMessage);
          message.text.should.eql('chrome');
          message.attributes.should.eql({ version: 31 });
          const fileCopy = message.getFile();
          fileCopy.should.not.be.exactly(file1);
          fileCopy.should.be.instanceof(File);
          fileCopy.name().should.eql(FILE_NAME_1);
          fileCopy.id.should.eql(file1.id);
          fileCopy.url().should.eql(file1.url());
          fileCopy.metaData().should.eql(file1.metaData());
        });
    });
    it('file created from url', () =>
      Promise.resolve(new FileMessage(file)).then(message => {
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
        message.should.be.instanceof(FileMessage);
        message.text.should.eql('chrome');
        message.attributes.should.eql({ version: 31 });
        const fileCopy = message.getFile();
        fileCopy.should.not.be.exactly(file);
        fileCopy.should.be.instanceof(File);
        fileCopy.name().should.eql(FILE_NAME);
        fileCopy.id.should.eql(file.id);
        fileCopy.url().should.eql(file.url());
        fileCopy.metaData().should.eql(file.metaData());
      })
    );
    it('parser should be loose', () => {
      FileMessage.parse({ _lcfile: { url: FILE_URL } })
        .should.be.instanceof(FileMessage);
    });
  });

  describe('ImageMessage', () => {
    it('param check', () => {
      (() => new ImageMessage('1')).should.throw();
    });
    it('should inherit from FileMessage', () =>
      Promise.resolve(new ImageMessage(file)).then(message => {
        message.setText('chrome');
        message.setAttributes({ version: 31 });
        message.getFile().should.be.exactly(file);
        const json = message.toJSON();
        json.should.containDeep({
          _lctype: -2,
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
        return ImageMessage.parse(json);
      }).then(message => {
        message.should.be.instanceof(ImageMessage);
        message.should.be.instanceof(FileMessage);
        message.text.should.eql('chrome');
        message.attributes.should.eql({ version: 31 });
        const fileCopy = message.getFile();
        fileCopy.should.not.be.exactly(file);
        fileCopy.should.be.instanceof(File);
        fileCopy.name().should.eql(FILE_NAME);
        fileCopy.id.should.eql(file.id);
        fileCopy.url().should.eql(file.url());
        fileCopy.metaData().should.eql(file.metaData());
      })
    );
  });

  describe('AudioMessage', () => {
    it('param check', () => {
      (() => new AudioMessage('1')).should.throw();
    });
    it('should inherit from FileMessage', () =>
      Promise.resolve(new AudioMessage(file)).then(message => {
        message.setText('chrome');
        message.setAttributes({ version: 31 });
        message.getFile().should.be.exactly(file);
        const json = message.toJSON();
        json.should.containDeep({
          _lctype: -3,
        });
        return AudioMessage.parse(json);
      }).then(message => {
        message.should.be.instanceof(AudioMessage);
        message.should.be.instanceof(FileMessage);
        const fileCopy = message.getFile();
        fileCopy.should.not.be.exactly(file);
        fileCopy.should.be.instanceof(File);
      })
    );
  });
  describe('VideoMessage', () => {
    it('param check', () => {
      (() => new VideoMessage('1')).should.throw();
    });
    it('should inherit from FileMessage', () =>
      Promise.resolve(new VideoMessage(file)).then(message => {
        message.setText('chrome');
        message.setAttributes({ version: 31 });
        message.getFile().should.be.exactly(file);
        const json = message.toJSON();
        json.should.containDeep({
          _lctype: -4,
        });
        return VideoMessage.parse(json);
      }).then(message => {
        message.should.be.instanceof(VideoMessage);
        message.should.be.instanceof(FileMessage);
        const fileCopy = message.getFile();
        fileCopy.should.not.be.exactly(file);
        fileCopy.should.be.instanceof(File);
      })
    );
  });
});
