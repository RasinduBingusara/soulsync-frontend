import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface PostProps {
  id: string | null,
  title: string,
  content: string,
  uid: string,
  email: string,
  isAnonymouse: boolean,
  profileName: string,
  profileImage: string
}

const Post = ({ id, title, content, uid, email, isAnonymouse, profileName, profileImage='' }: PostProps) => {

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        {
          isAnonymouse ? (
            <View style={styles.profileContainer}>
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
              <Text style={styles.profileName}>Anonymouse</Text>
            </View>
          ) : (
            <View style={styles.profileContainer}>
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
              <Text style={styles.profileName}>{profileName}</Text>
            </View>
          )
        }

        <TouchableOpacity>
          <Text>Follow</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{content}</Text>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          {/* <Icon name="heart-outline" size={24} color="#555" /> */}
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          {/* <Icon name="comment-outline" size={24} color="#555" /> */}
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes the image circular
    marginRight: 10,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 16,
    color:'black'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    color: '#555',
  },
});

export default Post;