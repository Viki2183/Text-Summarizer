from django.urls import path
from .views import SummarizeTextAPIView, FileUploadAPIView

urlpatterns = [
    path('api/summarize/', SummarizeTextAPIView.as_view(), name='summarize-text'),
    path('api/upload/', FileUploadAPIView.as_view(), name='upload-file'),
]

