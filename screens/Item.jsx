import {
    createStackNavigator
} from "@react-navigation/stack";
import {Modal, ScrollView, StyleSheet } from "react-native"
import { Colors, Drawer, Text, View, ActionBar, Incubator, Picker, Button } from "react-native-ui-lib";
const Stack = createStackNavigator();
import { FlatList } from "react-native"
import React from "react"
import axios from "axios";
import { BarCodeScanner } from "expo-barcode-scanner";
import {useDebounce} from "use-debounce"

function Item(props) {
    return (
        <Drawer style={{
            padding: 10,
            justifyContent: "center",
        }} rightItems={[
            {
                background: "#eee",
            },
            {
                background: Colors.blue50,
                icon: require('../assets/icons/info.png'),
                onPress: () => {props.navigator.navigate("Details", { id: props.id })}
            },
            {
                icon: require('../assets/icons/edit.png'),
                background: Colors.green30,
                onPress: () => {props.navigator.navigate("Update", { id: props.id})}
            },
            {
                icon: require('../assets/icons/delete.png'),
                background: Colors.red30,
                onPress: () => props.navigator.navigate("Delete", { id: props.id, name: props.text })
            },

        ]} ><Text style={{ paddingLeft: 20, paddingVertical: 5 }}>{props.text}</Text></Drawer>
    )
}

function DetailItem(props) {
    return (
        <Drawer style={{
            padding: 10,
            justifyContent: "center",
        }} rightItems={[
            {
                background: "#eee",
            },
            {
                icon: require('../assets/icons/edit.png'),
                background: Colors.green30,
                onPress: () => {props.navigation.navigate("Update Item", { id1: props.id1, route: props.route, id: props.id, description: props.description, value: props.value})}
            },
            {
                icon: require('../assets/icons/delete.png'),
                background: Colors.red30,
                onPress: () => props.navigation.navigate("Delete Item", { id1: props.id1, route: props.route, id: props.id, description: props.description })
            },
        ]} >
            <Text style={{ paddingLeft: 20, paddingVertical: 5, fontWeight: "bold" }}>{props.description}</Text>
            <Text style={{ paddingLeft: 20 }}>{props.value}</Text>
        </Drawer>
    )
}

const detailStyles = StyleSheet.create({
    value: {
        fontWeight: "bold",
        fontFamily: "monospace",
    },
    title: { fontSize: 20, fontWeight: "bold", paddingVertical: 10  }
})

function CreateItem(props) {
    const [description, setDescription] = React.useState("")
    const [value, setValue] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    return (
    <View>
        <View style={{ marginVertical: 30 }}>
        <Incubator.TextField floatingPlaceholder placeholder="Deskripsi" value={description} onChangeText={e => setDescription(e)} style={{ borderBottomWidth: 1, borderBottomColor: Colors.blue30, marginHorizontal: 10 }} marginH={10} floatingPlaceholderStyle={{marginHorizontal: 10}}/>
        <Incubator.TextField floatingPlaceholder placeholder="Jumlah" value={value} onChangeText={e => setValue(e)} style={{ borderBottomWidth: 1, borderBottomColor: Colors.blue30, marginHorizontal: 10 }} marginH={10} floatingPlaceholderStyle={{marginHorizontal: 10}}/>
        </View>
        <Button disabled={loading} style={{ marginTop: 20, marginHorizontal: 25 }} onPress = {async () => {
            setLoading(true)
            await axios.post(`https://sinar-pagi-harga-barang.herokuapp.com/products/${props.route.params.id1}/${props.route.params.route}`, {
                description, value
            }).then(() => props.navigation.goBack())
        }} backgroundColor={Colors.blue40} on><Text white>Tambah +</Text></Button>
    </View>)
}
function UpdateItem(props) {
    const [description, setDescription] = React.useState(props.route.params.description)
    const [value, setValue] = React.useState(props.route.params.value)
    const [loading, setLoading] = React.useState(false)
    return (
    <View>
        <View style={{ marginVertical: 30 }}>
        <Incubator.TextField floatingPlaceholder placeholder="Deskripsi" value={description} onChangeText={e => setDescription(e)} style={{ borderBottomWidth: 1, borderBottomColor: Colors.blue30, marginHorizontal: 10 }} marginH={10} floatingPlaceholderStyle={{marginHorizontal: 10}}/>
        <Incubator.TextField floatingPlaceholder placeholder="Jumlah" value={value} onChangeText={e => setValue(e)} style={{ borderBottomWidth: 1, borderBottomColor: Colors.blue30, marginHorizontal: 10 }} marginH={10} floatingPlaceholderStyle={{marginHorizontal: 10}}/>
        </View>
        <Button disabled={loading} style={{ marginTop: 20, marginHorizontal: 25 }} onPress = {async () => {
            setLoading(true)
            await axios.put(`https://sinar-pagi-harga-barang.herokuapp.com/products/${props.route.params.id1}/${props.route.params.route}/${props.route.params.id}`, {
                description, value
            }).then(() => props.navigation.goBack())
        }} backgroundColor={Colors.blue40} on><Text white>Update</Text></Button>
    </View>)
}
function DeleteItem(props) {
    const [loading, setLoading] = React.useState(false)
    return (
    <View>
        <View style={{ marginVertical: 30 }}>
            <Text center>Hapus item <Text underline>{props.route.params.description}</Text>?</Text>
        </View>
        <Button disabled={loading} style={{ marginTop: 20, marginHorizontal: 25 }} onPress = {async () => {
            setLoading(true)
            await axios.delete(`https://sinar-pagi-harga-barang.herokuapp.com/products/${props.route.params.id1}/${props.route.params.route}/${props.route.params.id}`).then(() => props.navigation.goBack())
        }} backgroundColor={Colors.red40} on><Text white>Iya</Text></Button>
        <Button disabled={loading} style={{ marginTop: 20, marginHorizontal: 25 }} onPress={async () => {
            setLoading(true)
            props.navigation.goBack()
        }} backgroundColor={Colors.green40} on><Text white>Tidak</Text></Button>
    </View>)
}

function Details(props) {
    const [data, setData ] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    async function reload() {
        setLoading(true)
        const {data} = await axios.get(`https://sinar-pagi-harga-barang.herokuapp.com/products/${props.route.params.id}?select=id,name,description,BuyingDiscounts,SellingDiscounts,SellingPrices,BuyingPrices,Distributor`)
        setData(data.data)
        setLoading(false)
    }

    React.useEffect(() => {
        axios.get(`https://sinar-pagi-harga-barang.herokuapp.com/products/${props.route.params.id}?select=id,name,description,BuyingDiscounts,SellingDiscounts,SellingPrices,BuyingPrices,Distributor`)
        .then(result => {
            setData(result.data.data);
            setLoading(false);
        })
    }, [])

    return (
        <ScrollView style={{padding: 10}}>
            {/* <Text>{JSON.stringify(data)}</Text> */}
            {data &&            <><Text center style={detailStyles.title}>{data.name}</Text>
          <View style={{ marginHorizontal: 10, marginTop: 20 }}>
                <Text>Barcode: <Text style={detailStyles.value}>{loading ? "Loading..." : data.id}</Text></Text>
                <Text>Deskripsi: <Text style={detailStyles.value}>{loading ? "Loading..." : data.description}</Text></Text>
                {data && <Text>Distributor: <Text style={detailStyles.value}>{loading ? "Loading..." : data.Distributor.name}</Text></Text>}
            </View></>}
            <Text center style={detailStyles.title}> Modal </Text>
            { data && data.BuyingPrices.map(e => (<View key={e.id}><DetailItem id={e.id}  id1={data.id} route="buying-price"  navigation={props.navigation} description={e.description} value={e.value} /></View>)) }
            <Button style={{margin: 10}} onPress={() => props.navigation.navigate("Create Item", { id1: data.id, route: "buying-price" })} backgroundColor={Colors.blue40}><Text white>Tambah +</Text></Button>
            <Text center style={detailStyles.title}> Harga Jual </Text>
            { data && data.SellingPrices.map(e =>  (<View key={e.id}><DetailItem id={e.id} id1={data.id} route="selling-price" navigation={props.navigation} description={e.description} value={e.value} /></View>)) }
            <Button style={{margin: 10}} onPress={() => props.navigation.navigate("Create Item", { id1: data.id, route: "selling-price" })} backgroundColor={Colors.blue40}><Text white>Tambah +</Text></Button>
            <Text center style={detailStyles.title}> Diskon Beli </Text>
            { data && data.BuyingDiscounts.map(e => (<View key={e.id}><DetailItem id={e.id}  id1={data.id} route="buying-discount" navigation={props.navigation} description={e.description} value={e.value} /></View>)) }
            <Button style={{margin: 10}}  onPress={() => props.navigation.navigate("Create Item", { id1: data.id, route: "buying-discount" })} backgroundColor={Colors.blue40}><Text white>Tambah +</Text></Button>
            <Text center style={detailStyles.title}> Diskon Jual </Text>
            { data && data.SellingDiscounts.map(e =>  (<View key={e.id}><DetailItem id={e.id} id1={data.id} route="selling-discount"  navigation={props.navigation} description={e.description} value={e.value} /></View>)) }
            <Button style={{margin: 10}} onPress={() => props.navigation.navigate("Create Item", { id1: data.id, route: "selling-discount" })}  backgroundColor={Colors.blue40}><Text white>Tambah +</Text></Button>
            <Button onPress={reload} style={{ marginVertical: 5, marginHorizontal: 15, marginBottom: 50 }} backgroundColor={Colors.yellow30}><Text white>Reload</Text></Button>
        </ScrollView>
    )
}

function Update(props) {
    const [distributors, setDistributors] = React.useState([]);
    const [barcode, setBarcode] = React.useState(props?.route?.params?.id || "");
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [selectedDitributorName, setSelectedDitributorName] = React.useState(null);
    const [selectedDitributorId, setSelectedDitributorId] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        axios.get(`https://sinar-pagi-harga-barang.herokuapp.com/products/${props?.route?.params?.id}?select=id,name,description,Distributor`).then(result => {
            setBarcode(result.data.data.id);
            setName(result.data.data.name);
            setDescription(result.data.data.description);
            setSelectedDitributorName(result.data.data.Distributor.name);
            setSelectedDitributorId(result.data.data.Distributor.id);
        })
        axios.get("https://sinar-pagi-harga-barang.herokuapp.com/distributors").then(result => setDistributors(result.data.data)).catch(err => console.log(err))
        setLoading(false);
    }, [])

    return (
    <View style={{ padding: 15 }}>
        <Incubator.TextField textDisabled={loading} placeholder="Barcode" value={barcode} onChangeText={val => setBarcode(val)}  floatingPlaceholderStyle={style.floatingPlaceholder}  floatingPlaceholder  style={style.input} />
        <Incubator.TextField textDisabled={loading} placeholder="Nama Barang" value={name} onChangeText={val => setName(val)} floatingPlaceholderStyle={style.floatingPlaceholder}  floatingPlaceholder  style={style.input} />
        <Incubator.TextField textDisabled={loading} placeholder="Deskripsi" value={description} onChangeText={val => setDescription(val)} floatingPlaceholderStyle={style.floatingPlaceholder} floatingPlaceholder  style={style.input} />
        <Picker migrateTextField placeholder={selectedDitributorName || "Distributor"}
            onChange={val => {
                setSelectedDitributorName(val.label)
                setSelectedDitributorId(val.value)
            }}
        >
            {distributors.map(distributor => <Picker.Item key={distributor.id} label={distributor.name} value={distributor.id} />)}
        </Picker>
        <Button onPress={async () => {
            setLoading(true);
            await axios.put(`https://sinar-pagi-harga-barang.herokuapp.com/products/${barcode}`, {
                name, description, distributorId: selectedDitributorId, id: barcode
            })
            setLoading(false);
            props.navigation.navigate("List")
        }} backgroundColor={Colors.blue40} disabled={loading}><Text white >Update</Text></Button>
    </View>)
}

function Delete(props) {
    return (
    <View>
        <Text center style={{ fontWeight: "bold", fontSize: 20, marginVertical: 15 }}>Hapus {props.route.params.name}?</Text>
        <Button onPress={async () => {
            await axios.delete(`https://sinar-pagi-harga-barang.herokuapp.com/products/${props.route.params.id}`)
            props.navigation.navigate("List")
        }} style={{backgroundColor: Colors.red30, marginHorizontal: 30, marginVertical: 20}}><Text white>Iya</Text></Button>
        <Button onPress={() => props.navigation.navigate("List")} style={{backgroundColor: Colors.green30, marginHorizontal: 30, marginVertical: 20}}><Text white>Tidak</Text></Button>
    </View>)
} 

const style = StyleSheet.create({
    floatingPlaceholder: { paddingHorizontal: 10, marginBottom: 10 },
    input: { padding: 10, flex: 1, paddingVertical: 5, borderWidth: 1, borderColor: "#ddd", marginBottom: 10 }
})

function Create(props) {
    const [distributors, setDistributors] = React.useState([]);
    const [barcode, setBarcode] = React.useState(props?.route?.params?.id || "");
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [selectedDitributorName, setSelectedDitributorName] = React.useState(null);
    const [selectedDitributorId, setSelectedDitributorId] = React.useState(1);
    const [submitted, setSubmitted] = React.useState(false);

    async function create() {
        setSubmitted(true);
        await axios.post("https://sinar-pagi-harga-barang.herokuapp.com/products", {
            id: barcode,
            name,
            description,
            distributorId: selectedDitributorId,
        }).then(result => {
            props.navigation.goBack();
        }).catch(err => console.log(err))

    }

    React.useEffect(() => {
        axios.get("https://sinar-pagi-harga-barang.herokuapp.com/distributors").then(result => setDistributors(result.data.data)).catch(err => console.log(err))
    }, [])
    return (<View style={{margin: 10}}>
        <Incubator.TextField placeholder="Barcode" value={barcode} onChangeText={val => setBarcode(val)}  floatingPlaceholderStyle={style.floatingPlaceholder}  floatingPlaceholder  style={style.input} />
        <Incubator.TextField placeholder="Nama Barang" value={name} onChangeText={val => setName(val)} floatingPlaceholderStyle={style.floatingPlaceholder}  floatingPlaceholder  style={style.input} />
        <Incubator.TextField placeholder="Deskripsi" value={description} onChangeText={val => setDescription(val)} floatingPlaceholderStyle={style.floatingPlaceholder} floatingPlaceholder  style={style.input} />
        <Picker migrateTextField placeholder={selectedDitributorName || "Distributor"}
            onChange={val => {
                setSelectedDitributorName(val.label)
                setSelectedDitributorId(val.value)
            }}
        >
            {distributors.map(distributor => <Picker.Item key={distributor.id} label={distributor.name} value={distributor.id} />)}
        </Picker>
        <Button blue40 disabled={submitted} onPress={create}><Text white>Tambah</Text></Button>
    </View>)
}



export function Scan(props) {

    if (hasPermission === null) {
        return <Text center >Requesting for camera permission</Text>;
      }
      if (hasPermission === false) {
        return <Text center>No access to camera</Text>;
      }


    const [hasPermission, setHasPermission] = useState(null);
    useEffect(() => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);

    async function handleScan({ data}) {
        const item = await axios.get(`https://sinar-pagi-harga-barang.herokuapp.com/products/${data}?select=id,name,description,BuyingDiscounts,Distributor`)
        props.navigation.navigate("List")
        item.data.data ? props.navigation.navigate("Details", { id: item.data.data.id }) : props.navigation.navigate("Create", { id: data })
    }

    return (
        <View style={{ width: "100%", height: "100%" }}>
            <BarCodeScanner onBarCodeScanned={handleScan} style={StyleSheet.absoluteFillObject} />
        </View>
    )
}

export function List(props) {
    const [items, setItems] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState("")
    const [value] = useDebounce(search, 800);
    async function reloadData() {
        setPage(1);
        axios.get(`https://sinar-pagi-harga-barang.herokuapp.com/products?take=20&page=${page}`).then(result => setItems(result.data.data)).catch(err => console.log(err))
    }

    React.useEffect(() => {
        console.log(value)
        axios.get(`https://sinar-pagi-harga-barang.herokuapp.com/products?search=${value}&take=20&page=${page}`).then(result => setItems(result.data.data)).catch(err => console.log(err))
    }, [value, page])

    
    return ( 
        <View>
            <Incubator.TextField floatingPlaceholder placeholder="Search" value={search} onChangeText={e => setSearch(e)} style={{ borderBottomWidth: 1, borderBottomColor: Colors.blue30, marginHorizontal: 10 }} marginH={10} floatingPlaceholderStyle={{marginHorizontal: 10}}/>
            <FlatList 
                data={items} 
                keyExtractor={(x) => x.id.toString()}
                renderItem={({ item }) => {return <Item id={item.id} text={item.name} navigator={props.navigation}/>}}
                style={{maxHeight: 300}}
            />
            <View style={{ marginVertical: 30 }}>
                <Button onPress={() => props.navigation.navigate("Create")} style={{ marginVertical: 5, marginHorizontal: 15 }} backgroundColor={Colors.green30}><Text white>Tambah Barang</Text></Button>
                <Button onPress={() => props.navigation.navigate("Scan")} style={{ marginVertical: 5, marginHorizontal: 15 }} backgroundColor={Colors.blue30}><Text white>Scan Barang</Text></Button>
                <Button onPress={reloadData} style={{ marginVertical: 5, marginHorizontal: 15 }} backgroundColor={Colors.yellow30}><Text white>Reload</Text></Button>
            </View>
            <ActionBar keepRelative actions={[
                {label: "Prev", onPress: () => {page > 1 && setPage(page - 1)}, blue30: true},
                {label: "Next", onPress: () => {setPage(page + 1)}, blue30: true},
            ]}/>
        </View>
    )
}

export default function ItemScreen(props) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="List" component={List} />
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen name="Create" component={Create} />
            <Stack.Screen name="Scan" component={Scan} />
            <Stack.Screen name="Delete" component={Delete} />
            <Stack.Screen name="Update" component={Update} />
            <Stack.Screen name="Create Item" component={CreateItem} />
            <Stack.Screen name="Update Item" component={UpdateItem} />
            <Stack.Screen name="Delete Item" component={DeleteItem} />
        </Stack.Navigator>
    )
}