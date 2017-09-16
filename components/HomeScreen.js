import React, { Component } from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import UserModel from '../Model/UserModel';
import storage from '../Model/PosterificStorage';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Image
        resizeMode="cover"
        source={require('./../assets/images/login-splash-bg.jpg')}
        style={styles.splashContainer}
      >
      <Text style={styles.mainTitle}>Poster!</Text>
        <Text style={styles.subTitle}>Poster making made easy.</Text>

        <LoginButton onLoginFinished={(error, result) => {
                if(error) {
                  alert('Login failed with error: ' + error.toString());
                } else if(result.isCancelled) {
                  alert('Login was cancelled');
                } else {
                  let tmpThis = this;
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      if(data == null) {
                        console.warn('No access token available');
                      } else {
                        console.log('got access token: ' + data.accessToken);
                        console.log('permissions: ' + data.permissions);
                        let graphPath = '/me?fields=id,first_name,picture{url}';
                        let requestHandler = (error, result) => {
                          if(!error) {
                            console.log(result.id + ', ' +
                                        result.first_name + ', ' +
                                        result.picture.data.url);
                            let user = new UserModel(result.id, result.first_name, result.picture.data.url);
                            storage.save({
                              key: 'user',
                              rawData: {
                                user
                              }
                            });
                            tmpThis.props.navigator.push({
                              name: 'PosterList'
                            });
                          }
                        };
                        let userInfoRequest = new GraphRequest(graphPath, null, requestHandler);
                        new GraphRequestManager().addRequest(userInfoRequest).start();
                      }
                    }
                  );
                }
              }}
              onLogoutFinished={() => {
                this.props.navigator.popToTop();
              }} />

        <TouchableOpacity
          onPress={
            () => {
              this.props.navigator.push({
                name: 'PosterList'
              });
            }
          }
        >
          <View style={{ flexDirection: 'row', justifyContent: 'center', width: 180, height: 28, backgroundColor: '#4167ae', borderRadius: 3, margin: 20 }}>
            <Text style={{ margin: 3, color: 'white', fontWeight: 'bold' }}>Get Started</Text>
          </View>
        </TouchableOpacity>

      </Image>
    );
  }
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  mainTitle: {
    fontSize: 72,
    color: 'white'
  },
  subTitle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    fontSize: 18,
    color: 'white',
    marginBottom: 50
  }
});
