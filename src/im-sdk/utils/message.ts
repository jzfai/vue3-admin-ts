import { $t } from '@/locales';
import { MessageBrief, MessageData } from '../types';

export function generateBrief(message: MessageData) {
  let brief = '';
  if (message.type === 'txt') {
    brief = message.msg;
  } else if (message.type === 'img') {
    brief = $t('message.imgBrief');
  } else if (message.type === 'audio') {
    brief = $t('message.audioBrief');
  } else if (message.type === 'video') {
    brief = $t('message.videoBrief');
  } else if (message.type === 'call') {
    if (message.callType === 'audio') {
      brief = $t('call.audioCall');
    } else {
      brief = $t('call.videoCall');
    }
  } else {
    brief = $t('message.otherBrief');
  }
  const data: MessageBrief = {
    id: message.id,
    brief,
    sender: message.from,
  };
  return data;
}

export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src); // 清理 blob URL
      resolve(audio.duration);
    };

    audio.onerror = (e) => {
      reject(new Error('Failed to load audio metadata'));
    };

    audio.src = URL.createObjectURL(file);
  });
}
