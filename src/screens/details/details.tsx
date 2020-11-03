import React, { Component } from 'react'
import { ActivityIndicator, Platform, View, Text, Switch, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BleManager } from 'react-native-ble-plx'

interface DetailsProps {}
interface DetailsState {
  info: any
  values: any
  devices: Array<any>
  activityIndicator: boolean
  selectedDevice: any
}

let windows_height: number = Dimensions.get('window').height

class DetailsLayout extends Component<DetailsProps, DetailsState> {
  public manager: any
  public commands: any
  constructor(props: any) {
    super(props)
    this.manager = new BleManager()
    this.state = {
      info: '',
      values: {},
      devices: [],
      activityIndicator: true,
      selectedDevice: null,
    }
    this.commands = {
      ATStart: 'QVRTdGFydC8=',
      ATOn: 'QVRPbi8=',
      ATOff: 'QVRPZmYv',
    }

    this.scanAndConnect = this.scanAndConnect.bind(this)
    this.onTouchReload = this.onTouchReload.bind(this)
    this.onTouchDevice = this.onTouchDevice.bind(this)
  }

  componentDidMount() {
    this.scanAndConnect()
  }

  info(message: any) {
    this.setState({ info: message })
  }

  error(message: any) {
    this.setState({ info: 'ERROR: ' + message })
  }

  updateValue(key: any, value: any) {
    this.setState({ values: { ...this.state.values, [key]: value } })
  }

  scanAndConnect() {
    const devices: Array<any> = []
    setTimeout(() => {
      this.manager.stopDeviceScan()
      this.setState({ activityIndicator: false })
    }, 5000)
    this.manager.startDeviceScan(null, null, (error: any, device: any) => {
      if (error) {
        console.log(error)
        return
      }

      const filter = this.state.devices.filter((exist_device: any) => {
        if (exist_device.id === device.id) return exist_device
      })

      if (filter.length === 0) devices.push(device)
      this.setState({ devices })
    })
  }

  onTouchReload() {
    this.setState({ activityIndicator: true })
    this.scanAndConnect()
  }

  onTouchDevice(touchedDevice: any, ATCommand: string) {
    if (this.state.selectedDevice !== null) {
      this.setupNotifications(this.state.selectedDevice, ATCommand)
    } else {
      this.manager.startDeviceScan(null, null, (error: any, device: any) => {
        this.info('Scanning...')

        if (error) {
          this.error(error.message)
          return
        }

        if (device.name === 'KawaApp') {
          this.setState({ selectedDevice: device })
          this.info('Connecting to KawaApp')
          this.manager.stopDeviceScan()
          device
            .connect()
            .then((device: any) => {
              this.info('Discovering services and characteristics')
              return device.discoverAllServicesAndCharacteristics()
            })
            .then((device: any) => {
              this.info('Setting notifications')
              return this.setupNotifications(device, ATCommand)
            })
            .then(
              () => {
                this.info('Connected...')
              },
              (error: any) => {
                this.error(error.message)
              },
            )
        }
      })
    }
  }

  async setupNotifications(device: any, ATCommand: string) {
    const service = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'
    const characteristicW = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'

    const characteristic = await device.writeCharacteristicWithoutResponseForService(service, characteristicW, ATCommand)
    console.log(characteristic)
  }

  render() {
    return (
      <View style={styles.main}>
        <Text style={styles.title}>Detalles</Text>
        <FlatList
          data={this.state.devices}
          renderItem={(device: any) => {
            return (
              <View style={styles.device}>
                <Text>
                  {device.item.id} {device.item.name}
                </Text>
                <View style={styles.device_buttons}>
                  <TouchableOpacity
                    style={styles.flat_list_buttons}
                    onPress={() => {
                      this.onTouchDevice(device.item, this.commands.ATOn)
                    }}
                  >
                    <Text>On</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.flat_list_buttons}
                    onPress={() => {
                      this.onTouchDevice(device.item, this.commands.ATOff)
                    }}
                  >
                    <Text>Off</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
        />
        <View>
          <Text>{this.state.info}</Text>
        </View>
        <TouchableOpacity onPress={this.onTouchReload} style={styles.button_reload} disabled={this.state.activityIndicator}>
          {this.state.activityIndicator ? <ActivityIndicator color='black' size={20} /> : <Text style={styles.button_reload_text}>Reload</Text>}
        </TouchableOpacity>
      </View>
    )
  }
}

export default DetailsLayout

const styles = StyleSheet.create({
  main: {
    padding: 15,
    position: 'relative',
    height: windows_height - 70,
  },
  title: { fontSize: 20, marginBottom: 10 },
  flat_list_buttons: {
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginBottom: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    backgroundColor: 'lightgray',
  },
  button_reload: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    height: 40,
    position: 'absolute',
    bottom: 50,
    left: 15,
    width: '100%',
  },
  button_reload_text: {
    color: 'white',
    fontWeight: 'bold',
  },
  device: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  device_buttons: {
    display: 'flex',
    flexDirection: 'row',
    width: '30%',
    justifyContent: 'space-between',
  },
})
