"""
URL configuration for settings project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin 
from django.urls import path , include, re_path
from django.http import JsonResponse
from django.views.static import serve as media_serve

from django.conf import settings
from django.conf.urls.static import static


def healthcheck(request):
    """Lightweight liveness endpoint used by Docker/Coolify health checks."""
    return JsonResponse({'status': 'ok'})


urlpatterns = [
    path('health/', healthcheck, name='healthcheck'),
    path('admin/', admin.site.urls),
    path('server/auth/', include('accounts.urls')),
    path('server/blog/', include('blog.urls')),
    path('auth/', include('drf_social_oauth2.urls', namespace='drf')),
    path('server/', include('dealvers.urls')),
]

# static() is a no-op when DEBUG is False, so serve media explicitly in
# container deployments where no object storage/CDN is configured.
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
if getattr(settings, 'SERVE_MEDIA', False) and not settings.DEBUG:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', media_serve, {'document_root': settings.MEDIA_ROOT}),
    ]
