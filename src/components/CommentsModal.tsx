import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { X, Send, Building2, MessageSquare, Sparkles } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export const CommentsModal: React.FC = () => {
  const { showCommentsModal, selectedPostForComments, closeComments, comments, addComment } = useApp();
  const [commentText, setCommentText] = useState('');

  if (!showCommentsModal || !selectedPostForComments) return null;

  const postComments = comments[selectedPostForComments.id] || [];

  const handleSend = () => {
    if (!commentText.trim()) return;
    addComment(selectedPostForComments.id, commentText);
    setCommentText('');
  };

  return (
    <Modal
      visible={showCommentsModal}
      transparent
      animationType="slide"
      onRequestClose={closeComments}
    >
      <View style={styles.overlay}>
        {/* Backdrop Dismiss */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeComments} />

        <View style={styles.sheetContainer}>
          {/* Top Drag Handle */}
          <View style={styles.sheetHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleGroup}>
              <View style={styles.badgePill}>
                <MessageSquare color={colors.crimson} size={11} />
                <Text style={styles.headerBadge}>COUNCIL DISCUSSION</Text>
              </View>
              <Text style={styles.headerTitle}>Comments & Replies ({postComments.length})</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeComments} activeOpacity={0.7}>
              <X color={colors.textPrimary} size={18} />
            </TouchableOpacity>
          </View>

          {/* Original Post Snippet */}
          <View style={styles.postSnippetBox}>
            <View style={styles.snippetHeaderRow}>
              <Text style={styles.snippetAuthor}>{selectedPostForComments.authorName}</Text>
              <Text style={styles.snippetTag}>{selectedPostForComments.tag}</Text>
            </View>
            <Text style={styles.snippetContent} numberOfLines={2}>
              "{selectedPostForComments.content}"
            </Text>
          </View>

          {/* Comments List */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.commentsList}>
            {postComments.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconBg}>
                  <MessageSquare color={colors.textMuted} size={24} />
                </View>
                <Text style={styles.emptyTitle}>No replies yet</Text>
                <Text style={styles.emptyText}>Be the first council member to respond or offer a solution!</Text>
              </View>
            ) : (
              postComments.map(c => (
                <View key={c.id} style={styles.commentItem}>
                  <Image source={{ uri: c.authorAvatar }} style={styles.avatar} />
                  <View style={styles.commentBubble}>
                    <View style={styles.authorRow}>
                      <Text style={styles.authorName}>{c.authorName}</Text>
                      <Text style={styles.createdAt}>{c.createdAt}</Text>
                    </View>
                    <View style={styles.companyRow}>
                      <Building2 color={colors.primary} size={10.5} />
                      <Text style={styles.authorCompany}>{c.authorCompany}</Text>
                    </View>
                    <Text style={styles.commentText}>{c.text}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="Write a response or inquiry..."
              placeholderTextColor={colors.textMuted}
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !commentText.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!commentText.trim()}
              activeOpacity={0.8}
            >
              <Send color={colors.white} size={15} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 25, 44, 0.65)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheetContainer: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    height: '78%',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 25,
  },
  sheetHandle: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleGroup: {
    flex: 1,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.crimsonLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  headerBadge: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.crimson,
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  postSnippetBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    borderLeftWidth: 3.5,
    borderLeftColor: colors.crimson,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  snippetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  snippetAuthor: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  snippetTag: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.crimson,
    backgroundColor: colors.crimsonLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  snippetContent: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  commentsList: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  authorName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  createdAt: {
    fontSize: 10,
    color: colors.textMuted,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  authorCompany: {
    fontSize: 10.5,
    color: colors.textSecondary,
  },
  commentText: {
    fontSize: 12.5,
    color: colors.textPrimary,
    lineHeight: 17,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textPrimary,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.crimson,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendBtnDisabled: {
    backgroundColor: colors.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
});
