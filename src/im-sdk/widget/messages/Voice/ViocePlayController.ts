// useAudioPlayer.ts
import { reactive } from 'vue';
import BenzAMRRecorder from 'benz-amr-recorder';

const state = reactive({
  isPlaying: false,
  playMsgId: '',
});

let armRec: BenzAMRRecorder | null = null;

const playAudio = async (msgId: string, url: string) => {
  if (state.isPlaying && state.playMsgId === msgId) {
    armRec?.playOrPauseOrResume();
    return;
  }

  if (state.isPlaying && armRec) {
    armRec.stop();
    state.isPlaying = false;
    state.playMsgId = '';
    armRec = null;
  }

  armRec = new BenzAMRRecorder();

  armRec.onPlay(() => {
    console.log('onPlay 触发');
    state.isPlaying = true;
    state.playMsgId = msgId;
  });

  armRec.onPause(() => {
    state.isPlaying = false;
    state.playMsgId = '';
  });

  armRec.onStop(() => {
    state.isPlaying = false;
    state.playMsgId = '';
    armRec = null;
  });
  try {
    await armRec.initWithUrl(url);
    armRec.playOrPauseOrResume();
  } catch (err) {
    console.error('音频加载失败', err);
    return;
  }
};

const stopAudio = () => {
  if (armRec) {
    armRec.stop();
    armRec = null;
    state.isPlaying = false;
    state.playMsgId = '';
  }
};

export function useAudioPlayer() {
  return {
    audioPlayStatus: state,
    playAudio,
    stopAudio,
  };
}
