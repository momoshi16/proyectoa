import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert } from 'react-native';

type Usuario = {
  nombre: string;
  correo: string | null;
  matricula: string | null;
  grado: string | null;
  tipo_usuario: string;
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editarId, setEditarId] = useState<string | null>(null);
  const [editarUsuario, setEditarUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/usuarios')
      .then(res => res.json())
      .then(data => {
        if (data.usuarios) {
          setUsuarios(data.usuarios);
        } else {
          Alert.alert('Error', 'No se recibieron datos de usuarios');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'No se pudo obtener la lista de usuarios');
      });
  }, []);

  // Iniciar edición: guardar copia del usuario para editar
  const iniciarEdicion = (usuario: Usuario) => {
    setEditarId(usuario.nombre);
    setEditarUsuario({ ...usuario });
  };

  // Guardar edición: validar y actualizar usuario
const guardarEdicion = () => {
  if (!editarUsuario) return;
      console.log('Todos los usuarios actuales:', editarUsuario);
  if (editarUsuario.nombre.trim() === '') {
    alert('El nombre no puede estar vacío');
    return;
  }

  // Enviar datos al backend
  fetch('http://localhost:3000/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editarUsuario),
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        // Actualizar estado local con los datos editados
        setUsuarios(usuarios.map(u =>
          u.nombre === editarId ? { ...editarUsuario } : u
        ));
        setEditarId(null);
        setEditarUsuario(null);
        alert(data.message);
      } else {
        alert('No se pudo guardar el usuario');
      }
    })
    .catch(() => {
      alert('No se pudo conectar con el servidor');
    });
};


  // Actualizar campo editable en estado editarUsuario
  const onChangeCampo = (campo: keyof Usuario, valor: string) => {
    if (!editarUsuario) return;
    const nuevoEstado = { ...editarUsuario, [campo]: valor };
    console.log('Editar usuario actualizado:', nuevoEstado);
    setEditarUsuario(nuevoEstado);

  };

  const eliminarUsuario = (nombre: string) => {
    setUsuarios(usuarios.filter(u => u.nombre !== nombre));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuarios</Text>

      <FlatList
        data={usuarios}
        keyExtractor={item => item.nombre}
        renderItem={({ item }) => (
          <View style={styles.usuarioContainer}>
            {editarId === item.nombre && editarUsuario ? (
              <>
                <TextInput
                  style={[styles.inputEditar, { flex: 2 }]}
                  value={editarUsuario.nombre}
                  onChangeText={v => onChangeCampo('nombre', v)}
                  placeholder="Nombre"
                />
                <TextInput
                  style={[styles.inputEditar, { flex: 3 }]}
                  value={editarUsuario.correo || ''}
                  onChangeText={v => onChangeCampo('correo', v)}
                  placeholder="Correo"
                />
                <TextInput
                  style={[styles.inputEditar, { flex: 2 }]}
                  value={editarUsuario.matricula || ''}
                  onChangeText={v => onChangeCampo('matricula', v)}
                  placeholder="Matrícula"
                />
                <TextInput
                  style={[styles.inputEditar, { flex: 2 }]}
                  value={editarUsuario.grado || ''}
                  onChangeText={v => onChangeCampo('grado', v)}
                  placeholder="Grado"
                />
                <TextInput
                  style={[styles.inputEditar, { flex: 2 }]}
                  value={editarUsuario.tipo_usuario}
                  onChangeText={v => onChangeCampo('tipo_usuario', v)}
                  placeholder="Tipo Usuario"
                />

                <Button title="Guardar" onPress={guardarEdicion} />
              </>
            ) : (
              <>
                <Text style={[styles.campoTexto, { flex: 2 }]}>{item.nombre}</Text>
                <Text style={[styles.campoTexto, { flex: 3 }]}>{item.correo || '-'}</Text>
                <Text style={[styles.campoTexto, { flex: 2 }]}>{item.matricula || '-'}</Text>
                <Text style={[styles.campoTexto, { flex: 2 }]}>{item.grado || '-'}</Text>
                <Text style={[styles.campoTexto, { flex: 2 }]}>{item.tipo_usuario}</Text>

                <Button title="Editar" onPress={() => iniciarEdicion(item)} />
                <Button title="Eliminar" onPress={() => eliminarUsuario(item.nombre)} color="red" />
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
  usuarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  campoTexto: {
    fontSize: 16,
    paddingHorizontal: 4,
  },
  inputEditar: {
    borderColor: '#888',
    borderWidth: 1,
    padding: 6,
    marginRight: 6,
    borderRadius: 5,
  },
});
