import firebase from 'react-native-firebase';
const CHATS = 'chats';

export default class FirebaseService {
  firestore = firebase.firestore();
  constructor(reciever) {
    this.sender = global.USER._id;
    this.reciever = reciever;
    if (this.sender > this.reciever)
      this.collectionName = this.sender?.toString() + this.reciever?.toString();
    else
      this.collectionName = this.reciever?.toString() + this.sender?.toString();
    this.messageRef = this.firestore.collection(`${this.collectionName}`);
    this.chatRef = this.firestore.collection(`CHATINFO`);
  }

  async fetchChats() {
    const chats = await Promise.all([
      this.chatRef.where('user1', '==', this.sender).get(),
      this.chatRef.where('user2', '==', this.sender).get(),
    ]);
    let chatDocs = [...chats[0].docs, ...chats[1].docs];
    chatDocs.sort(
      (chat1, chat2) => chat1._data.updatedAt < chat2._data.updatedAt,
    );
    return chatDocs;
  }

  async createChat(lastMessage) {
    await this.chatRef.doc(this.collectionName).set(
      {
        user1: this.sender,
        user2: this.reciever,
        lastMessage: lastMessage,
        updatedAt: new Date(),
      },
      {merge: true},
    );
  }

  async fetchMessages() {
    const chat = await this.messageRef.orderBy('createdAt', 'desc').get();

    return chat.docs;
  }

  async createMessage(type, message) {
    await this.createChat(message);
    await this.messageRef.add({
      type,
      message,
      senderId: this.sender,
      createdAt: new Date(),
    });
  }
}

// {
//   chat1: {
//     m1: {
//       message: '',
//       name: '',
//       createdAt: '',
//     },
//   },
//   chat2: {}
// }
