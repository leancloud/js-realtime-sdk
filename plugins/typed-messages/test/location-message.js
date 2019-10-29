import 'should';
import 'should-sinon';
import isPlainObject from 'lodash/isPlainObject';
import { GeoPoint } from 'leancloud-storage';
import { LocationMessage, TypedMessagesPlugin } from '../src';
import { Realtime } from '../../../src';
import IMClient from '../../../src/im-client';

const realtime = new Realtime({
  appId: 'for-test',
  appKey: 'for-test',
  server: 'for-test',
  plugins: TypedMessagesPlugin,
});
const client = new IMClient('test', undefined, {
  _messageParser: realtime._messageParser,
  _plugins: realtime._plugins,
});

const LATITUDE = 39.9704503;
const LONGITUDE = 116.3783714;
const location = new GeoPoint(LATITUDE, LONGITUDE);

describe('LocationMessage', () => {
  it('param check', () => {
    (() => new LocationMessage('1')).should.throw();
  });
  it('parse and getPayload', () => {
    const message = new LocationMessage(location);
    message.setText('Jinao');
    message.setAttributes({ district: 'Haidian' });
    message.getLocation().should.be.exactly(location);
    const json = message.getPayload();
    json.should.eql({
      _lctype: -5,
      _lctext: 'Jinao',
      _lcattrs: { district: 'Haidian' },
      _lcloc: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },
    });
    const parsedMessage = LocationMessage.parse(json);
    parsedMessage.summary.should.eql('[位置] Jinao');
    const locationCopy = parsedMessage.getLocation();
    locationCopy.should.be.instanceof(GeoPoint);
    locationCopy.should.not.be.exactly(location);
    locationCopy.latitude.should.eql(LATITUDE);
    locationCopy.longitude.should.be.eql(LONGITUDE);
  });
  it('toJSON', () => {
    const message = new LocationMessage(location);
    const json = message.toJSON();
    json.location.should.be.ok();
    isPlainObject(json.location).should.be.ok();
  });
  it('serialize and parse', async () => {
    const message = new LocationMessage(location);
    const json = message.toFullJSON();
    const parsedMessage = await client.parseMessage(
      JSON.parse(JSON.stringify(json))
    );
    parsedMessage.should.be.instanceof(LocationMessage);
    parsedMessage.toFullJSON().should.eql(json);
  });
});
