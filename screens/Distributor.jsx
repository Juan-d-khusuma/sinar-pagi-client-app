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

function InfoItem(props) {
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
                onPress: () => {props.navigation.navigate("Update Details", { id1: props.id1, route: props.route, id: props.id, description: props.description, value: props.value})}
            },
            {
                icon: require('../assets/icons/delete.png'),
                background: Colors.red30,
                onPress: () => props.navigation.navigate("Delete Details", { id1: props.id1, route: props.route, id: props.id, description: props.description })
            },
        ]} >
            <Text style={{ paddingLeft: 20, paddingVertical: 5, fontWeight: "bold" }}>{props.description}</Text>
            <Text style={{ paddingLeft: 20 }}>{props.value}</Text>
        </Drawer>)
}

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
                onPress: () => {props.navigation.navigate("Details", { id: props.id })}
            },
            {
                icon: require('../assets/icons/edit.png'),
                background: Colors.green30,
                onPress: () => {props.navigation.navigate("Update", { id: props.id})}
            },
            {
                icon: require('../assets/icons/delete.png'),
                background: Colors.red30,
                onPress: () => props.navigation.navigate("Delete", { id: props.id, name: props.text })
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
                background: Colors.blue50,
                icon: require('../assets/icons/info.png'),
                onPress: () => {props.navigation.navigate("Item Details", { id: props.id })}
            },
            {
                icon: require('../assets/icons/edit.png'),
                background: Colors.green30,
                onPress: () => {props.navigation.navigate("Update Product", { id: props.id })}
            },
            {
                icon: require('../assets/icons/delete.png'),
                background: Colors.red30,
                onPress: () => props.navigation.navigate("Delete Product", {  id: props.id, name: props.name })
            },
        ]} >
            <Text style={{ paddingLeft: 20, paddingVertical: 5, fontWeight: "bold" }}>{props.name}</Text>
            <Text style={{ paddingLeft: 20 }}>{props.description}</Text>
        </Drawer>
    )
}

function ItemDetails(props) {
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
            { data && data.BuyingPrices.map(e => (<View key={e.id}><InfoItem id={e.id}  id1={data.id} route="buying-price"  navigation={props.navigation} description={e.description} value={e.value} /></View>)) }
            <Button style={{margin: 10}} onPress={() => props.navigation.navigate("Create Item", { id1: data.id, route: "buying-price" })} backgroundColor={Colors.blue40}><Text white>Tambah +</Text></Button>
            <Text center style={detailStyles.title}> Harga Jual </Text>
            { data && data.SellingPrices.map(e =>  (<View key={e.id}><InfoItem id={e.id} id1={data.id} route="selling-price" navigation={props.navigation} description={e.description} value={e.value} /></View>)) }
            <Button style={{margin: 10}} onPress={() => props.navigation.navigate("Create Item", { id1: data.id, route: "selling-price" })} backgroundColor={Colors.blue40}><Text white>Tambah +</Text></Button>
            <Text center style={detailStyles.title}> Diskon Beli </Text>
            { data && data.BuyingDiscounts.map(e => (<View key={e.id}><InfoItem id={e.id}  id1={data.id} route="buying-discount" navigation={props.navigation} description={e.description} value={e.value} /></View>)) }
            <Button style={{margin: 10}}  onPress={() => props.navigation.navigate("Create Item", { id1: data.id, route: "buying-discount" })} backgroundColor={Colors.blue40}><Text white>Tambah +</Text></Button>
            <Text center style={detailStyles.title}> Diskon Jual </Text>
            { data && data.SellingDiscounts.map(e =>  (<View key={e.id}><InfoItem id={e.id} id1={data.id} route="selling-discount"  navigation={props.navigation} description={e.description} value={e.value} /></View>)) }
            <Button style={{margin: 10}} onPress={() => props.navigation.navigate("Create Item", { id1: data.id, route: "selling-discount" })}  backgroundColor={Colors.blue40}><Text white>Tambah +</Text></Button>
            <Button onPress={reload} style={{ marginVertical: 5, marginHorizontal: 15, marginBottom: 50 }} backgroundColor={Colors.yellow30}><Text white>Reload</Text></Button>
        </ScrollView>
    )
}

const detailStyles = StyleSheet.create({
    value: {
        fontWeight: "bold",
        fontFamily: "monospace",
    },
    title: { fontSize: 20, fontWeight: "bold", paddingVertical: 10  }
})

function CreateDetail(props) {
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
function UpdateDetail(props) {
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
function DeleteDetail(props) {
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
        const {data} = await axios.get(`https://sinar-pagi-harga-barang.herokuapp.com/distributors/${props.route.params.id}?select=id,name,description,address,phone,email,Products`)
        setData(data.data)
        setLoading(false)
    }

    React.useEffect(() => {
        axios.get(`https://sinar-pagi-harga-barang.herokuapp.com/distributors/${props.route.params.id}?select=id,name,description,address,phone,email,Products`)
        .then(result => {
            setData(result.data.data);
            setLoading(false);
        })
    }, [])

    return (
        <ScrollView style={{padding: 10}}>
            {/* <Text>{JSON.stringify(data)}</Text> */}
            {data && <><Text center style={detailStyles.title}>{data.name}</Text>
          <View style={{ marginHorizontal: 10, marginTop: 20 }}>
                <Text>Nama Toko: <Text style={detailStyles.value}>{loading ? "Loading..." : data.name}</Text></Text>
                <Text>Deskripsi: <Text style={detailStyles.value}>{loading ? "Loading..." : data.description}</Text></Text>
                <Text>Alamat: <Text style={detailStyles.value}>{loading ? "Loading..." : data.address}</Text></Text>
                <Text>No. Telp: <Text style={detailStyles.value}>{loading ? "Loading..." : data.phone}</Text></Text>
                <Text>Email: <Text style={detailStyles.value}>{loading ? "Loading..." : data.email}</Text></Text>
            </View></>}
            <Text center style={detailStyles.title}> Produk </Text>
            { data && data.Products.map(e => (<View key={e.id}><DetailItem id={e.id}  id1={data.id} route="buying-price"  navigation={props.navigation} name={e.name} description={e.description} /></View>)) }
            <Button style={{margin: 10}} onPress={() => props.navigation.navigate("Create Product", { distributorId: data.id })} backgroundColor={Colors.blue40}><Text white>Tambah +</Text></Button>
            <Button style={{margin: 10}} onPress={() => props.navigation.navigate("Scan", {distributorId: data.id})} backgroundColor={Colors.green40}><Text white>Scan</Text></Button>
            <Button onPress={reload} style={{ marginVertical: 5, marginHorizontal: 15, marginBottom: 50 }} backgroundColor={Colors.yellow30}><Text white>Reload</Text></Button>
        </ScrollView>
    )
}

function Update(props) {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        axios.get(`https://sinar-pagi-harga-barang.herokuapp.com/distributors/${props?.route?.params?.id}?select=id,name,description,address,phone,email`).then(result => {
            setName(result.data.data.name);
            setDescription(result.data.data.description);
            setAddress(result.data.data.address);
            setPhone(result.data.data.phone);
            setEmail(result.data.data.email);
        })
        setLoading(false);
    }, [])

    return (
    <View style={{ padding: 15 }}>
        <Incubator.TextField textDisabled={loading} placeholder="Nama Toko" value={name} onChangeText={val => setName(val)} floatingPlaceholderStyle={style.floatingPlaceholder}  floatingPlaceholder  style={style.input} />
        <Incubator.TextField textDisabled={loading} placeholder="Deskripsi" value={description} onChangeText={val => setDescription(val)} floatingPlaceholderStyle={style.floatingPlaceholder} floatingPlaceholder  style={style.input} />
        <Incubator.TextField textDisabled={loading} placeholder="Alamat" value={address} onChangeText={val => setAddress(val)} floatingPlaceholderStyle={style.floatingPlaceholder} floatingPlaceholder  style={style.input} />
        <Incubator.TextField textDisabled={loading} placeholder="No. Telp" value={phone} onChangeText={val => setPhone(val)} floatingPlaceholderStyle={style.floatingPlaceholder} floatingPlaceholder  style={style.input} />
        <Incubator.TextField textDisabled={loading} placeholder="Email" value={email} onChangeText={val => setEmail(val)} floatingPlaceholderStyle={style.floatingPlaceholder} floatingPlaceholder  style={style.input} />
        <Button onPress={async () => {
            setLoading(true);
            await axios.put(`https://sinar-pagi-harga-barang.herokuapp.com/distributors/${props?.route?.params?.id}`, {
                name, description, address,
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
            await axios.delete(`https://sinar-pagi-harga-barang.herokuapp.com/distributors/${props.route.params.id}`)
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
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);

    async function create() {
        setSubmitted(true);
        await axios.post("https://sinar-pagi-harga-barang.herokuapp.com/distributors", {
            name,
            description,
            address,
            phone,
            email,
        }).then(result => {
            props.navigation.navigate("List");
        }).catch(err => console.log(err))

    }

    return (<View style={{margin: 10}}>
        <Incubator.TextField placeholder="Nama Toko" value={name} onChangeText={val => setName(val)} floatingPlaceholderStyle={style.floatingPlaceholder}  floatingPlaceholder  style={style.input} />
        <Incubator.TextField placeholder="Deskripsi" value={description} onChangeText={val => setDescription(val)} floatingPlaceholderStyle={style.floatingPlaceholder} floatingPlaceholder  style={style.input} />
        <Incubator.TextField placeholder="Alamat" value={address} onChangeText={val => setAddress(val)} floatingPlaceholderStyle={style.floatingPlaceholder} floatingPlaceholder  style={style.input} />
        <Incubator.TextField placeholder="No. Telp" value={phone} onChangeText={val => setPhone(val)} floatingPlaceholderStyle={style.floatingPlaceholder} floatingPlaceholder  style={style.input} />
        <Incubator.TextField placeholder="Email" value={email} onChangeText={val => setEmail(val)} floatingPlaceholderStyle={style.floatingPlaceholder} floatingPlaceholder  style={style.input} />
        <Button backgroundColor={Colors.blue40} style={{ marginVertical: 20 }} disabled={submitted} onPress={create}><Text white>Tambah</Text></Button>
    </View>)
}

export function List(props) {
    const [items, setItems] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState("")
    const [value] = useDebounce(search, 800);
    async function reloadData() {
        setPage(1);
        axios.get(`https://sinar-pagi-harga-barang.herokuapp.com/distributors?take=20page=${page}`).then(result => setItems(result.data.data)).catch(err => console.log(err))
    }

    React.useEffect(() => {
        console.log(value)
        axios.get(`https://sinar-pagi-harga-barang.herokuapp.com/distributors?search=${value}&take=20&page=${page}`).then(result => setItems(result.data.data)).catch(err => console.log(err))
    }, [value, page])

    
    return ( 
        <View>
            <Incubator.TextField floatingPlaceholder placeholder="Search" value={search} onChangeText={e => setSearch(e)} style={{ borderBottomWidth: 1, borderBottomColor: Colors.blue30, marginHorizontal: 10 }} marginH={10} floatingPlaceholderStyle={{marginHorizontal: 10}}/>
            <FlatList 
                data={items} 
                keyExtractor={(x) => x.id.toString()}
                renderItem={({ item }) => {return <Item id={item.id} text={item.name} navigation={props.navigation}/>}}
                style={{ maxHeight: 300 }}
            />
            <View style={{ marginVertical: 30 }}>
                <Button onPress={() => props.navigation.navigate("Create")} style={{ marginVertical: 5, marginHorizontal: 15 }} backgroundColor={Colors.green30}><Text white>Tambah Distributor</Text></Button>
                <Button onPress={reloadData} style={{ marginVertical: 5, marginHorizontal: 15 }} backgroundColor={Colors.yellow30}><Text white>Reload</Text></Button>
            </View>
            <ActionBar keepRelative actions={[
                {label: "Prev", onPress: () => {page > 1 && setPage(page - 1)}, blue30: true},
                {label: "Next", onPress: () => {setPage(page + 1)}, blue30: true},
            ]}/>
        </View>
    )
}

export function Scan(props) {
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
        item.data.data ? props.navigation.navigate("Item Details", { id: item.data.data.id }) : props.navigation.navigate("Create Product", { id: data, distributorId: props.route.params.distributorId })
    }

    if (hasPermission === null) {
        return <Text center >Requesting for camera permission</Text>;
      }
      if (hasPermission === false) {
        return <Text center>No access to camera</Text>;
      }

    return (
        <View style={{ width: "100%", height: "100%" }}>
            <BarCodeScanner onBarCodeScanned={handleScan} style={StyleSheet.absoluteFillObject} />
        </View>
    )
}

function CreateProduct(props) {
    const [barcode, setBarcode] = React.useState(props?.route?.params?.id || "");
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);

    async function create() {
        setSubmitted(true);
        await axios.post("https://sinar-pagi-harga-barang.herokuapp.com/products", {
            id: barcode,
            name,
            description,
            distributorId: props.route.params.distributorId,
        }).then(result => {
            props.navigation.goBack();
        }).catch(err => console.log(err))

    }
    return (<View style={{margin: 10}}>
        <Incubator.TextField placeholder="Barcode" value={barcode} onChangeText={val => setBarcode(val)}  floatingPlaceholderStyle={style.floatingPlaceholder}  floatingPlaceholder  style={style.input} />
        <Incubator.TextField placeholder="Nama Barang" value={name} onChangeText={val => setName(val)} floatingPlaceholderStyle={style.floatingPlaceholder}  floatingPlaceholder  style={style.input} />
        <Incubator.TextField placeholder="Deskripsi" value={description} onChangeText={val => setDescription(val)} floatingPlaceholderStyle={style.floatingPlaceholder} floatingPlaceholder  style={style.input} />
        <Button blue40 disabled={submitted} onPress={create}><Text white>Tambah</Text></Button>
    </View>)
}

function DeleteProduct(props) {
    return (
    <View>
        <Text center style={{ fontWeight: "bold", fontSize: 20, marginVertical: 15 }}>Hapus {props.route.params.name}?</Text>
        <Button onPress={async () => {
            await axios.delete(`https://sinar-pagi-harga-barang.herokuapp.com/products/${props.route.params.id}`)
            props.navigation.goBack()
        }} style={{backgroundColor: Colors.red30, marginHorizontal: 30, marginVertical: 20}}><Text white>Iya</Text></Button>
        <Button onPress={() => props.navigation.goBack()} style={{backgroundColor: Colors.green30, marginHorizontal: 30, marginVertical: 20}}><Text white>Tidak</Text></Button>
    </View>)
} 

function UpdateProduct(props) {
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

export default function ItemScreen(props) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="List" component={List} />
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen name="Create" component={Create} />
            <Stack.Screen name="Delete" component={Delete} />
            <Stack.Screen name="Update" component={Update} />
            <Stack.Screen name="Create Item" component={CreateDetail} />
            <Stack.Screen name="Update Details" component={UpdateDetail} />
            <Stack.Screen name="Delete Details" component={DeleteDetail} />
            <Stack.Screen name="Item Details" component={ItemDetails} />
            <Stack.Screen name="Scan" component={Scan} />
            <Stack.Screen name="Create Product" component={CreateProduct} />
            <Stack.Screen name="Delete Product" component={DeleteProduct} />
            <Stack.Screen name="Update Product" component={UpdateProduct} />
        </Stack.Navigator>
    )
}