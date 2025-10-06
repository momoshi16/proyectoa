import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios, { AxiosError } from 'axios';



// Cambia según tu entorno
//const API_URL = 'http://192.168.1.254:3000/'; // Android emulador
// En dispositivo real: 'http://<tu_ip_local>:3000/api'

export default function Login({ navigation }: any) {
  const [correo, setCorreo] = useState('');
  const [pass, setPass] = useState('');

  const iniciarSesion = async () => {
  if (!correo || !pass) {
    alert('Por favor, ingresa correo y contraseña');
    return;
  }
  
  try {
    const res = await axios.post('http://localhost:3000/login', { correo, pass });
    navigation.navigate('Usuarios');
  }catch (err: unknown) {
    const error = err as AxiosError;
    if (error.response?.status === 401) {
      alert('Datos incorrectos o no válidos');
    } else {
      alert('Error en la conexión o servidor');
    }
}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={pass}
        onChangeText={setPass}
        secureTextEntry
      />

      <TouchableOpacity style={styles.boton} onPress={iniciarSesion}>
        <Text style={styles.botonTexto}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  boton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
