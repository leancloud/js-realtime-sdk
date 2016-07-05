import 'should';
import 'should-sinon';
import { LocationMessage } from '../src/';
import { GeoPoint } from 'leancloud-storage';

describe('LocationMessage', () => {
  it('param check', () => {
    (() => new LocationMessage('1')).should.throw();
  });
  it('parse and toJSON', () => {
    const LATITUDE = 39.9704503;
    const LONGITUDE = 116.3783714;
    const location = new GeoPoint(LATITUDE, LONGITUDE);
    const message = new LocationMessage(location);
    message.setText('Jinao');
    message.setAttributes({ district: 'Haidian' });
    message.getLocation().should.be.exactly(location);
    const json = message.toJSON();
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
    const locationCopy = parsedMessage.getLocation();
    locationCopy.should.be.instanceof(GeoPoint);
    locationCopy.should.not.be.exactly(location);
    locationCopy.latitude.should.eql(LATITUDE);
    locationCopy.longitude.should.be.eql(LONGITUDE);
  });
});
