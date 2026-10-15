from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FileUploadSerializer
from .summarizer_utils import extract_text_from_pdf, extract_text_from_docx, generate_summary
from gtts import gTTS
from django.conf import settings
import os


class SummarizeTextAPIView(APIView):
    def post(self, request):
        text = request.data.get('text', '')
        to_speech = request.data.get('to_speech', False)

        if not text.strip():
            return Response({"error": "Text input is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            summary = generate_summary(text)
            response_data = {"summary": summary}

            # If speech requested
            if to_speech:
                tts = gTTS(summary)
                audio_filename = "summary.mp3"
                audio_path = os.path.join(settings.MEDIA_ROOT, audio_filename)
                tts.save(audio_path)
                response_data["audio_url"] = request.build_absolute_uri(settings.MEDIA_URL + audio_filename)

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FileUploadAPIView(APIView):
    def post(self, request):
        to_speech = request.data.get('to_speech', False)

        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            uploaded_file = serializer.validated_data['file']
            file_type = uploaded_file.name.split('.')[-1].lower()

            try:
                # Extract text based on file type
                if file_type == 'pdf':
                    text = extract_text_from_pdf(uploaded_file)
                elif file_type in ['docx', 'doc']:
                    text = extract_text_from_docx(uploaded_file)
                else:
                    return Response({"error": "Unsupported file type"}, status=status.HTTP_400_BAD_REQUEST)

                if not text.strip():
                    return Response({"error": "No text could be extracted from the file."}, status=status.HTTP_400_BAD_REQUEST)

                summary = generate_summary(text)
                response_data = {"summary": summary}

                # If speech requested
                if to_speech:
                    tts = gTTS(summary)
                    audio_filename = "summary.mp3"
                    audio_path = os.path.join(settings.MEDIA_ROOT, audio_filename)
                    tts.save(audio_path)
                    response_data["audio_url"] = request.build_absolute_uri(settings.MEDIA_URL + audio_filename)

                return Response(response_data, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)