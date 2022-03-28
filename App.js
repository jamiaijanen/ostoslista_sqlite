import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { Header, ListItem } from 'react-native-elements';
import { Input } from 'react-native-elements';
import { Button } from 'react-native-elements';

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [listItems, setListItems] = useState([])
  const database = SQLite.openDatabase('shoppinglistdb.db')

  useEffect(() => {
    database.transaction(tx => {
      tx.executeSql('create table if not exists listItems (id integer primary key not null, amount text, product text);');
    }, null, updateList);
  }, []);

  const save = () => {
    database.transaction(tx => {
      tx.executeSql('insert into listItems (amount, product) values (?, ?);',
        [amount, product]);
    }, null, updateList)
  }

  const updateList = () => {
    database.transaction(tx => {
      tx.executeSql('select * from listItems;', [], (_, { rows })=>
      setListItems(rows._array)
      );
    }, null, null);
  }

  const deleteItem = (id) => {
    database.transaction(tx => {
      tx.executeSql('delete from listItems where id = ?;', [id]
      );
    }, null, updateList)
  }

  const renderItem = ({item}) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.product}</ListItem.Title>
        <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron 
        name="delete"
        color="red"
        onPress={() => deleteItem(item.id)}
      />
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'SHOPPING LIST', style: { color:  '#fff' } }}
      />
      <Input label="Product" style={styles.input} onChangeText={product => setProduct(product)} value={product} placeholder="Product" />
      <Input label="Amount" style={styles.input} onChangeText={amount => setAmount(amount)} value={amount} placeholder="Amount" />
      <Button onPress={save} title="SAVE" iconPosition='left' icon={{
        type: 'ionicon',
        name: 'save',
        size: 18,
        color: 'white',
      }} 
      />
      <Text style={styles.text}>Shopping list</Text>
      <FlatList style={{marginLeft : "5%", width: "100%"}}
        data={listItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 240,
    margin: 12,
  },
  text: {
    marginTop: 20,
    fontSize: 20,
  },
  listcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   },
});
