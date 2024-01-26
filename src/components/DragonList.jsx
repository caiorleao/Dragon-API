import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const DragonList = () => {
  const [dragons, setDragons] = useState([]);
  const [selectedDragon, setSelectedDragon] = useState(null);
  const [newDragon, setNewDragon] = useState({
    name: '',
    type: ''})
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon');
        if (!response.ok) {
          throw new Error(`Erro ao buscar os dragões: ${response.statusText}`);
        }
        const data = await response.json();
        setDragons(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dragons]);

  const openDetailsModal = (dragon) => {
    setSelectedDragon(dragon);
    setDetailsModalOpen(true);
  };
  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const openEditModal = (dragon) => {
    setSelectedDragon(dragon);
    setEditModalOpen(true);
  };

  const openDeleteModal = (dragon) => {
    setSelectedDragon(dragon);
    setDeleteModalOpen(true);
  };

  const closeDetailsModal = () => setDetailsModalOpen(false);
  const closeEditModal = () => setEditModalOpen(false);
  const closeCreateModal = () => setCreateModalOpen(false);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleEditChange = (e, field) => {
    setSelectedDragon((prevDragon) => ({
      ...prevDragon,
      [field]: e.target.value,
    }));
  };

  const updateDragon = async () => {
    try {
      const response = await fetch(`http://5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon/${selectedDragon.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedDragon),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar o dragão: ${response.statusText}`);
      }

      setDragons((prevDragons) =>
        prevDragons.map((dragon) =>
          dragon.id === selectedDragon.id ? selectedDragon : dragon
        )
      );

      setEditModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteDragon = async (dragonId) => {
    try {
      const response = await fetch(`http://5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon/${dragonId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Erro ao deletar o dragão: ${response.statusText}`);
      } else {
        setDragons((prevDragons) =>
          prevDragons.filter((dragon) => dragon.id !== dragonId)
        );
      }
      setDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const createDragon = async () => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 19) + ".000Z";
      const response = await fetch('http://5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newDragon.name,
          type: newDragon.type,
          histories: newDragon.histories,
          createdAt: formattedDate
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar o dragão: ${response.statusText}`);
      }

      const createdDragon = await response.json();

      setDragons((prevDragons) => [...prevDragons, createdDragon]);
      closeCreateModal()
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Lista de Dragões</h2>
      <button className="action-btn create" onClick={() => openCreateModal()}>
        Criar Dragão
      </button>
      <ul className="dragon-list">
        {dragons.map((dragon) => (
          <li key={dragon.id} className="dragon-container">
            <p className='name'>{dragon.name}</p>
            <p className='type'>Tipo: {dragon.type}</p>
            <p className='date'>Criado em: {new Date(dragon.createdAt).toLocaleString()}</p>

            <div className="action-buttons">
              <button className="action-btn details" onClick={() => openDetailsModal(dragon)}>
                Detalhes
              </button>
              <button className="action-btn edit" onClick={() => openEditModal(dragon)}>
                Editar
              </button>
              <button className="action-btn delete" onClick={() => openDeleteModal(dragon)}>
                Deletar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Modal isOpen={isDetailsModalOpen} onRequestClose={closeDetailsModal}
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#777777'
          },
          content: {
            position: 'absolute',
            top: '40px',
            left: '40px',
            right: '40px',
            bottom: '40px',
            border: '1px solid #5E88B0',
            background: '#1a1a1a',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px'
          }
        }}
      >
        <h2>Detalhes do Dragão</h2>
        {selectedDragon && (
          <div>
            <p>Nome: {selectedDragon.name}</p>
            <p>Tipo: {selectedDragon.type}</p>
            <p>Criado em: {new Date(selectedDragon.createdAt).toLocaleString()}</p>
          </div>
        )}
        <button onClick={closeDetailsModal}>Fechar</button>
      </Modal>

      <Modal isOpen={isCreateModalOpen} onRequestClose={closeCreateModal}
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#777777'
          },
          content: {
            position: 'absolute',
            top: '40px',
            left: '40px',
            right: '40px',
            bottom: '40px',
            border: '1px solid #5E88B0',
            background: '#1a1a1a',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px',
          }
        }}>
        <h2>Criar Dragão</h2>
        <div>
          <input type="text" placeholder='Nome do Dragão' value={newDragon.name} onChange={(e) => setNewDragon({ ...newDragon, name: e.target.value })} />
          <input type="text" placeholder='Tipo do Dragão' value={newDragon.type} onChange={(e) => setNewDragon({ ...newDragon, type: e.target.value })} />
          <textarea placeholder='Histórias do Dragão' value={newDragon.histories} onChange={(e) => setNewDragon({ ...newDragon, histories: e.target.value })} />
        </div>
        <button onClick={createDragon}>Criar</button>
        <button onClick={closeCreateModal}>Fechar</button>
      </Modal>


      <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal}
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#777777'
          },
          content: {
            position: 'absolute',
            top: '40px',
            left: '40px',
            right: '40px',
            bottom: '40px',
            border: '1px solid #5E88B0',
            background: '#1a1a1a',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px',
          }
        }}>
        <h2>Editar Dragão</h2>
        {selectedDragon && (
          <div>
            <input type="text" placeholder='Nome do Dragão' value={selectedDragon.name} onChange={(e) => handleEditChange(e, 'name')} />
            <input type="text" placeholder='Tipo do Dragão' value={selectedDragon.type} onChange={(e) => handleEditChange(e, 'type')} />
          </div>
        )}
        <button onClick={updateDragon}>Salvar</button>
        <button onClick={closeEditModal}>Fechar</button>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onRequestClose={closeDeleteModal}
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#777777'
          },
          content: {
            position: 'absolute',
            top: '40px',
            left: '40px',
            right: '40px',
            bottom: '40px',
            border: '1px solid #5E88B0',
            background: '#1a1a1a',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px'
          }
        }}>
        <h2>Deletar Dragão</h2>
        {selectedDragon && (
          <div>
            <p>Você tem certeza que deseja deletar o dragão {selectedDragon.name}?</p>
            <button onClick={() => deleteDragon(selectedDragon.id)}>Deletar</button>
            <button onClick={closeDeleteModal}>Cancelar</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DragonList;
