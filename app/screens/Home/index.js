/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Button, Image } from 'react-native';
import { Icon } from 'native-base';
import styles from './styles';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { RNCamera } from 'react-native-camera';
import { uploadInvoiceImage } from '../../actions/homeActions';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: {},
      confirmation: '',
      isLoading: '',
      Invoice: '',
      Amount: '',
      Provider: '',
      Vendor: '',
      Description: '',
      fileUploaded: false,
    };
  }

  async chooseFile() {
    let source;
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      this.setState({ fileUploaded: false });
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        //  console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        source = response.data;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          filePath: response,
          confirmation: 'Extracting data',
        });
      }

      this.props.uploadInvoiceImage(source);
      // this.uploadImage(source);
      this.props.navigation.navigate('Ocr');
    });
  }

  takePicture = async() => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      this.setState({
        filePath: data.uri,
      });

      this.props.uploadInvoiceImage(data.base64);
      this.props.navigation.navigate('Ocr');
    }
  };

  render() {
    return (
      // <View style={styles.container}>
      //   <View style={styles.uploadHeader}>
      //     <Icon
      //       style={styles.uploadHeaderIcon}
      //       type="FontAwesome"
      //       name="file-image-o"
      //     />
      //     <Text style={styles.uploadHeaderText}>You need to Upload your</Text>
      //     <Text style={styles.uploadHeaderSubText}>Electricity Bill</Text>
      //   </View>
      //   <View style={styles.cameraBlock}>
      //     <Icon style={styles.cameraButton} type="FontAwesome" name="camera">
      //       {' '}
      //       <Text>Use Camera</Text>
      //     </Icon>
      //   </View>
      // <View style={styles.selectDocument}>
      //   <Text style={styles.orText}>-------------- or --------------</Text>
      //   <View style={styles.selectDocumentBtn}>
      //     <Icon
      //       style={styles.selectDocumentBtnIcon}
      //       type="FontAwesome"
      //       name="file-image-o"
      //     />
      //     <TouchableOpacity onPress={this.chooseFile.bind(this)}>
      //       <View>
      //         <Text style={styles.selectDocumentBtnText}>
      //           Select the document from Gallery
      //         </Text>
      //         <Text style={styles.selectDocumentBtnSubText}>
      //           (Only select PNG files)
      //         </Text>
      //       </View>
      //     </TouchableOpacity>
      //   </View>
      //   </View>
      // </View>
      <View style={styles.container}>
        <View>
          <View style={styles.cameraContainer}>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={styles.preview}
            />
            <View style={styles.cameraBlock}>
              <TouchableOpacity onPress={this.takePicture.bind(this)}>
                <Icon
                  style={styles.cameraButton}
                  type="FontAwesome"
                  name="camera">
                  <Text>Use Camera</Text>
                </Icon>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.selectDocument}>
            <Text style={styles.orText}>-------------- or --------------</Text>
            <View style={styles.selectDocumentBtn}>
              <Icon
                style={styles.selectDocumentBtnIcon}
                type="FontAwesome"
                name="file-image-o"
              />
              <TouchableOpacity onPress={this.chooseFile.bind(this)}>
                <View>
                  <Text style={styles.selectDocumentBtnText}>
                    Select the document from Gallery
                  </Text>
                  <Text style={styles.selectDocumentBtnSubText}>
                    (Only select PNG files)
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ homeReducer }) => {
  return {
    ocrInfo: homeReducer.ocrInfo,
    ocrInfoLoading: homeReducer.ocrInfoLoading,
  };
};

export default connect(mapStateToProps, { uploadInvoiceImage })(Home);
