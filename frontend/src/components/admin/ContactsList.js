import React, { useState, useEffect } from 'react';
import ContactItem from './ContactItem';
import SearchBar from './SearchBar';
import { fetchContacts } from '../../utils/api';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Charger les contacts depuis l'API
    fetchContacts().then(data => setContacts(data));
  }, []);
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const filteredContacts = contacts.filter(contact => 
    contact.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="contacts-container">
      <SearchBar onSearch={handleSearch} placeholder="Chercher Par Le nom" />
      
      <table className="contacts-table">
        <thead>
          <tr>
            <th>Nom complet</th>
            <th>E-mail</th>
            <th>N° Telephone</th>
            <th>Sujet</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map(contact => (
            <ContactItem key={contact.id} contact={contact} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactsList;