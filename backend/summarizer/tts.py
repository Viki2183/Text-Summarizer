from gtts import gTTS
import os
import uuid

def text_to_speech(text, lang='hi', save_dir='media'):
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
        
    file_name = f"{uuid.uuid4().hex}.mp3"
    file_path = os.path.join(save_dir, file_name)

    tts = gTTS(text=text, lang=lang)
    tts.save(file_path)

    return file_name
