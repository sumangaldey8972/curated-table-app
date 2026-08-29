import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Send, Sparkles, AlertCircle, FileText, Check, DollarSign, MessageSquare, Handshake, Trophy, Globe } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { Post } from '../types';
import { useApp } from '../context/AppContext';

export const PostCreationModal: React.FC = () => {
  const { showCreatePostModal, closeCreatePost, createPost } = useApp();

  const [tag, setTag] = useState<Post['tag']>('B2B Requirement');
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(true);
  const [budgetOrValue, setBudgetOrValue] = useState('₹ 50 Lakhs - ₹ 1 Cr');
  const [hasAttachment, setHasAttachment] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showCreatePostModal) return null;

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert('Please Enter Details', 'Please write what you are looking for.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      createPost(content.trim(), tag, isUrgent, budgetOrValue.trim() || undefined);
      setIsSubmitting(false);
      setContent('');
      closeCreatePost();
      Alert.alert('Post Published! 🚀', 'Your post is now live on the feed.');
    }, 900);
  };

  const tagConfigs: { tag: Post['tag']; icon: any; color: string }[] = [
    { tag: 'B2B Requirement', icon: AlertCircle, color: colors.crimson },
    { tag: 'Deal Won', icon: Trophy, color: colors.emerald },
    { tag: 'Partnership Ask', icon: Handshake, color: colors.accentBlue },
    { tag: 'General', icon: Globe, color: colors.primary },
  ];

  return (
    <Modal
      visible={showCreatePostModal}
      transparent
      animationType="slide"
      onRequestClose={closeCreatePost}
    >
      <View style={styles.overlay}>
        {/* Backdrop Dismiss Area */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeCreatePost} />

        <View style={styles.sheetContainer}>
          {/* Top Drag Handle */}
          <View style={styles.sheetHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleGroup}>
              <View style={styles.badgePill}>
                <MessageSquare color={colors.crimson} size={11} />
                <Text style={styles.headerBadge}>CURATED FEED</Text>
              </View>
              <Text style={styles.headerTitle}>Create a Post or Request</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeCreatePost} activeOpacity={0.7}>
              <X color={colors.textPrimary} size={18} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            {/* Category / Tag Selector */}
            <Text style={styles.inputLabel}>SELECT POST CATEGORY</Text>
            <View style={styles.tagsRow}>
              {tagConfigs.map(item => {
                const isSelected = tag === item.tag;
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={item.tag}
                    style={[styles.tagPill, isSelected && styles.tagPillSelected]}
                    onPress={() => setTag(item.tag)}
                    activeOpacity={0.7}
                  >
                    <Icon color={isSelected ? colors.crimson : colors.textSecondary} size={13} />
                    <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                      {item.tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Urgent Tag Toggle */}
            {tag === 'B2B Requirement' && (
              <TouchableOpacity
                style={[styles.urgentToggleBox, isUrgent && styles.urgentToggleBoxActive]}
                onPress={() => setIsUrgent(!isUrgent)}
                activeOpacity={0.8}
              >
                <View style={styles.urgentToggleLeft}>
                  <View style={[styles.urgentIconBg, isUrgent && styles.urgentIconBgActive]}>
                    <AlertCircle color={isUrgent ? colors.crimson : colors.textMuted} size={18} />
                  </View>
                  <View style={styles.urgentTextCol}>
                    <View style={styles.urgentLabelRow}>
                      <Text style={[styles.urgentTitle, isUrgent && styles.urgentTitleActive]}>
                        High-Priority Urgent Request
                      </Text>
                      {isUrgent && <View style={styles.livePulseDot} />}
                    </View>
                    <Text style={styles.urgentSub}>
                      Highlights this post to relevant council members immediately
                    </Text>
                  </View>
                </View>
                <View style={[styles.checkbox, isUrgent && styles.checkboxActive]}>
                  {isUrgent && <Check color={colors.white} size={12} strokeWidth={3} />}
                </View>
              </TouchableOpacity>
            )}

            {/* Budget / Value Input */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <DollarSign color={colors.crimson} size={14} />
                <Text style={styles.inputLabel}>BUDGET OR VALUE (OPTIONAL)</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={budgetOrValue}
                onChangeText={setBudgetOrValue}
                placeholder="e.g. ₹ 50 Lakhs - ₹ 1 Cr"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Post Content */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <FileText color={colors.crimson} size={14} />
                <Text style={styles.inputLabel}>POST DETAILS</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={content}
                onChangeText={setContent}
                placeholder="Describe what product, service, machinery, or partner you are looking for..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Document Attachment Simulation */}
            <TouchableOpacity
              style={[styles.attachmentBox, hasAttachment && styles.attachmentBoxActive]}
              onPress={() => setHasAttachment(!hasAttachment)}
              activeOpacity={0.8}
            >
              <View style={styles.attachIconBg}>
                <FileText color={hasAttachment ? colors.crimson : colors.textMuted} size={18} />
              </View>
              <View style={styles.attachInfo}>
                <Text style={[styles.attachTitle, hasAttachment && styles.attachTitleActive]}>
                  {hasAttachment ? 'Document_Details.pdf attached' : '+ Attach PDF / File (Optional)'}
                </Text>
                <Text style={styles.attachMeta}>
                  {hasAttachment ? '2.4 MB • Ready to upload with post' : 'Max 10 MB (PDF format)'}
                </Text>
              </View>
              <View style={[styles.checkbox, hasAttachment && styles.checkboxActive]}>
                {hasAttachment && <Check color={colors.white} size={12} strokeWidth={3} />}
              </View>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <View style={styles.submitLoadingRow}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.submitBtnText}>Publishing Post...</Text>
                </View>
              ) : (
                <View style={styles.submitRow}>
                  <Send color={colors.white} size={16} />
                  <Text style={styles.submitBtnText}>Publish Post to Council</Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
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
    maxHeight: '92%',
    paddingBottom: 24,
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
  body: {
    padding: 18,
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 14,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  tagPillSelected: {
    backgroundColor: colors.crimsonLight,
    borderColor: colors.crimson,
  },
  tagText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tagTextSelected: {
    color: colors.crimson,
    fontWeight: '800',
  },
  urgentToggleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  urgentToggleBoxActive: {
    backgroundColor: '#FFF8F8',
    borderColor: colors.crimson,
  },
  urgentToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  urgentIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  urgentIconBgActive: {
    backgroundColor: colors.crimsonLight,
  },
  urgentTextCol: {
    flex: 1,
  },
  urgentLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.crimson,
  },
  urgentTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  urgentTitleActive: {
    color: colors.crimson,
    fontWeight: '800',
  },
  urgentSub: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.crimson,
    borderColor: colors.crimson,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: colors.textPrimary,
    fontSize: 13.5,
    fontWeight: '500',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  attachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  attachmentBoxActive: {
    backgroundColor: '#FFF8F8',
    borderColor: colors.crimson,
  },
  attachIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  attachInfo: {
    flex: 1,
  },
  attachTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  attachTitleActive: {
    color: colors.crimson,
  },
  attachMeta: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: colors.crimson,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: colors.crimson,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnDisabled: {
    opacity: 0.75,
  },
  submitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
