/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

/* Ce que on veux comme donnée
* Locatisation
* Température
* Humidité
* UV
* Pollution
*/

import React, {Component} from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Dialog, { DialogContent, DialogTitle  } from 'react-native-popup-dialog';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import axios from 'axios';

var radio_props = [
  {label: 'Beaucoup', value: 2 },
  {label: 'Moyennement', value: 1 },
  {label: 'Aucunement', value: 0 }
];

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = { 
      forcast: {}, 
      showForcast: false, 
      showQuestion: true,
      pollution: {},
      value: -1
    };
  }

  takePicture = async function() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);

      const url = 'https://us-central1-startupweekend2019.cloudfunctions.net/forcast';

      return axios.get(url)
        .then(response => {
          console.log('Reponse :', response.data);
          this.setState({
            forcast: response.data,
            pollution: response.data.pollution,
            showForcast: true,
            showQuestion: false
          });
          console.log(this.state);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
            onGoogleVisionBarcodesDetected={({ barcodes }) => {
              console.log(barcodes);
            }}
          >
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
              <Text style={{ fontSize: 14 }}> SNAP </Text>
            </TouchableOpacity>
          </View>
          </RNCamera>

          <Dialog
            visible={this.state.showForcast}
            dialogTitle={<DialogTitle title="Today Envrionnement Data" />}
            onTouchOutside={() => {
              this.setState({ showForcast: false });
            }}
          >
            <DialogContent>
              <Text style={{ fontSize: 14 }}>Humidity : { this.state.forcast.humidity }</Text>
              <Text style={{ fontSize: 14 }}>Temperature : { (Math.round(this.state.forcast.temperature - 32) * 5/9).toFixed(2) } C </Text>
              <Text style={{ fontSize: 14 }}>Pressure : { this.state.forcast.pressure }</Text>
              <Text style={{ fontSize: 14 }}>UV : { this.state.forcast.uvIndex }</Text>
              <Text style={{ fontSize: 14 }}>Pollution : { this.state.pollution.pm25 }</Text>
              <Button
                title="Send"
                onPress={() => {
                  this.setState({ showForcast: false, showQuestion: true });
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            visible={this.state.showQuestion}
            dialogTitle={<DialogTitle title="Comment votre probleme de peau gratte : " />}
          >
            <DialogContent>
              <RadioForm
                  radio_props={radio_props}
                  initial={0}
                  onPress={(value) => {this.setState({value:value})}}
                />
              <Button
                title="Terminer"
                onPress={() => {
                  this.setState({ showQuestion: false });
                }}
              />
            </DialogContent>
          </Dialog>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
