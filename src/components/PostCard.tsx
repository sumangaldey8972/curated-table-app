import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import {
  Heart,
  MessageSquare,
  Share2,
  FileText,
  ShieldCheck,
  Send,
  Building2,
  Sparkles,
} from 'lucide-react-native';
import { Post } from '../types';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

interface PostCardProps {
  post: Post;
  onOpenProfile?: (authorId: string) => void;
  onDirectMessage?: (authorId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onOpenProfile, onDirectMessage }) => {
  const { toggleLikePost, openComments, openDigitalBusinessCard, users } = useApp();

  const authorUser = users.find(u => u.id === post.authorId);

  const getTagColor = (tag: Post['tag']) => {
    switch (tag) {
      case 'B2B Requirement':
        return { bg: colors.crimsonLight, text: colors.crimson, border: colors.crimsonBorder };
      case 'Deal Won':
        return { bg: colors.emeraldLight, text: colors.emerald, border: colors.emeraldBorder };
      case 'Partnership Ask':
        return { bg: colors.accentBlueLight, text: colors.accentBlue, border: colors.accentBlueBorder };
      case 'Event Highlight':
        return { bg: colors.purpleLight, text: colors.purpleAccent, border: colors.purpleBorder };
      default:
        return { bg: colors.cardBgElevated, text: colors.primary, border: colors.cardBorder };
    }
  };

  const tagStyle = getTagColor(post.tag);

  const handleShare = () => {
    Alert.alert('Post Copied', `Post from ${post.authorName} (${post.authorCompany}) copied to clipboard.`);
  };

  return (
    <View style={styles.card}>
      {/* Top Author Row */}
      <View style={styles.authorRow}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => {
            if (authorUser) {
              openDigitalBusinessCard(authorUser);
            }
          }}
          activeOpacity={0.8}
        >
          <Image source={{ uri: post.authorAvatar }} style={styles.avatar} />
          <View style={styles.verifiedIconBadge}>
            <ShieldCheck color={colors.emerald} size={12} />
          </View>
        </TouchableOpacity>

        <View style={styles.authorInfo}>
          <TouchableOpacity
            onPress={() => {
              if (authorUser) {
                openDigitalBusinessCard(authorUser);
              }
            }}
          >
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>{post.authorName}</Text>
              <View style={styles.chapterPill}>
                <Text style={styles.chapterPillText}>{post.chapter.replace(' Chapter', '')}</Text>
              </View>
            </View>
            <Text style={styles.authorDesignation} numberOfLines={1}>
              {post.authorDesignation}
            </Text>
            <View style={styles.companyRow}>
              <Building2 color={colors.primary} size={11} />
              <Text style={styles.companyName} numberOfLines={1}>
                {post.authorCompany}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.timeAgo}>{post.createdAt}</Text>
      </View>

      {/* Post Tag & Budget / Value Banner */}
      <View style={styles.tagHeaderRow}>
        <View style={[styles.tagBadge, { backgroundColor: tagStyle.bg, borderColor: tagStyle.border }]}>
          <Sparkles color={tagStyle.text} size={12} />
          <Text style={[styles.tagText, { color: tagStyle.text }]}>{post.tag}</Text>
        </View>

        {post.budgetOrValue && (
          <View style={styles.valueBadge}>
            <Text style={styles.valueBadgeText}>{post.budgetOrValue}</Text>
          </View>
        )}
      </View>

      {/* Post Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Document Attachment Preview */}
      {post.documentAttachment && (
        <TouchableOpacity
          style={styles.documentCard}
          onPress={() => Alert.alert('Open Document', `Opening ${post.documentAttachment?.name}`)}
          activeOpacity={0.8}
        >
          <View style={styles.docIconBox}>
            <FileText color={colors.crimson} size={20} />
          </View>
          <View style={styles.docInfo}>
            <Text style={styles.docName} numberOfLines={1}>
              {post.documentAttachment.name}
            </Text>
            <Text style={styles.docMeta}>
              {post.documentAttachment.type} • {post.documentAttachment.size} • Verified Document
            </Text>
          </View>
          <Text style={styles.docDownloadBtn}>View</Text>
        </TouchableOpacity>
      )}

      {/* Media Image */}
      {post.mediaUrl && (
        <View style={styles.mediaContainer}>
          <Image source={{ uri: post.mediaUrl }} style={styles.mediaImage} resizeMode="cover" />
        </View>
      )}

      {/* Interaction Footer Bar */}
      <View style={styles.footerBar}>
        <View style={styles.leftInteractions}>
          {/* Like */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => toggleLikePost(post.id)}
            activeOpacity={0.7}
          >
            <Heart
              color={post.isLiked ? colors.crimson : colors.textSecondary}
              fill={post.isLiked ? colors.crimson : 'transparent'}
              size={18}
            />
            <Text style={[styles.actionCount, post.isLiked && styles.activeLikedCount]}>
              {post.likesCount}
            </Text>
          </TouchableOpacity>

          {/* Comment */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => openComments(post)}
            activeOpacity={0.7}
          >
            <MessageSquare color={colors.textSecondary} size={18} />
            <Text style={styles.actionCount}>{post.commentsCount}</Text>
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.7}>
            <Share2 color={colors.textSecondary} size={17} />
          </TouchableOpacity>
        </View>

        {/* Connect / Direct Message */}
        <TouchableOpacity
          style={styles.directMessageBtn}
          onPress={() => {
            if (onDirectMessage && authorUser) {
              onDirectMessage(authorUser.id);
            } else if (authorUser) {
              openDigitalBusinessCard(authorUser);
            }
          }}
          activeOpacity={0.8}
        >
          <Send color={colors.white} size={13} />
          <Text style={styles.directMessageText}>Connect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.cardBgElevated,
    borderWidth: 1.5,
    borderColor: colors.crimson,
  },
  verifiedIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    padding: 2,
  },
  authorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chapterPill: {
    backgroundColor: colors.cardBgElevated,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chapterPillText: {
    fontSize: 9.5,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  authorDesignation: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 1,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  companyName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.primary,
  },
  timeAgo: {
    fontSize: 10.5,
    color: colors.textMuted,
    alignSelf: 'flex-start',
  },
  tagHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  valueBadge: {
    backgroundColor: colors.accentBlueLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accentBlueBorder,
  },
  valueBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accentBlue,
  },
  content: {
    fontSize: 13.5,
    lineHeight: 21,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
  },
  docIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.crimsonLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  docMeta: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  docDownloadBtn: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.crimson,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mediaContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  mediaImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.cardBgElevated,
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  leftInteractions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 2,
  },
  actionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeLikedCount: {
    color: colors.crimson,
  },
  directMessageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.crimson,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 5,
  },
  directMessageText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.white,
  },
});
