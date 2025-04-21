import React from 'react';
import DeleteButton from './DeleteButton';

const ContactItem = ({ contact }) => {
  const { nom, email, telephone, sujet } = contact;

  const handleDelete = () => {
    // Logique pour supprimer le contact
  };

  return (
    <tr>
      <td>{nom}</td>
      <td>{email}</td>
      <td>{telephone}</td>
      <td>{sujet}</td>
      <td>
        <DeleteButton onClick={handleDelete} />
      </td>
    </tr>
  );
};

export default ContactItem;