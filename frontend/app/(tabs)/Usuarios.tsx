import React, { useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert } from 'react-native';

type Usuario = {
  id: number;
  nombre: string;
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nombre: 'Juan' },
    { id: 2, nombre: 'Ana' },
  ]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [editarId, setEditarId] = useState<number | null>(null);
  const [editarNombre, setEditarNombre] = useState('');

  // Crear usuario
  const agregarUsuario = () => {
    if (nuevoNombre.trim() === '') {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    const nuevoUsuario = {
      id: Date.now(),
      nombre: nuevoNombre.trim(),
    };
    setUsuarios([...usuarios, nuevoUsuario]);
    setNuevoNombre('');
  };

  // Eliminar usuario
  const eliminarUsuario = (id: number) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  // Iniciar edición
  const iniciarEdicion = (usuario: Usuario) => {
    setEditarId(usuario.id);
    setEditarNombre(usuario.nombre);
  };

  // Guardar edición
  const guardarEdicion = () => {
    if (editarNombre.trim() === '') {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    setUsuarios(usuarios.map(u => (u.id === editarId ? { ...u, nombre: editarNombre.trim() } : u)));
    setEditarId(null);
    setEditarNombre('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuarios</Text>

      <View style={styles.crearContainer}>
        <TextInput
          placeholder="Nuevo usuario"
          value={nuevoNombre}
          onChangeText={setNuevoNombre}
          style={styles.input}
        />
        <Button title="Crear" onPress={agregarUsuario} />
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.usuarioContainer}>
            {editarId === item.id ? (
              <>
                <TextInput
                  value={editarNombre}
                  onChangeText={setEditarNombre}
                  style={styles.inputEditar}
                />
                <Button title="Guardar" onPress={guardarEdicion} />
              </>
            ) : (
              <>
                <Text style={styles.usuarioTexto}>{item.nombre}</Text>
                <Button title="Editar" onPress={() => iniciarEdicion(item)} />
                <Button title="Eliminar" onPress={() => eliminarUsuario(item.id)} color="red" />
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  crearContainer: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, padding: 8, marginRight: 10, borderRadius: 5 },
  usuarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  usuarioTexto: { flex: 1, fontSize: 18 },
  inputEditar: {
    flex: 1,
    borderColor: '#888',
    borderWidth: 1,
    padding: 6,
    marginRight: 10,
    borderRadius: 5
  },
});
