import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

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

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} onChangeText={product => setProduct(product)} value={product} placeholder="product" />
      <TextInput style={styles.input} onChangeText={amount => setAmount(amount)} value={amount} placeholder="amount" />
      <Button onPress={save} title="save" />
      <Text style={styles.text}>Shopping list</Text>
      <FlatList style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
          <View style={styles.listcontainer}>
            <Text>{item.product}, {item.amount} </Text>
            <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}>bought</Text>
          </View>}
          data={listItems}
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
    borderWidth: 1,
  },
  text: {
    marginTop: 20
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});
