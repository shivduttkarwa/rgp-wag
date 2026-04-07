from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from wagtail import urls as wagtail_urls
from wagtail.admin import urls as wagtailadmin_urls
from wagtail.documents import urls as wagtaildocs_urls
from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.images.api.v2.views import ImagesAPIViewSet
from wagtail.documents.api.v2.views import DocumentsAPIViewSet

from apps.home.api import HomePageAPIView
from apps.properties.api import PropertyListAPIView, PropertyDetailAPIView
from apps.forms.api import ContactFormAPIView, ExpressionOfInterestAPIView

# ─── Wagtail headless API router ─────────────────────────────────────────────

wagtail_api_router = WagtailAPIRouter("wagtailapi")
wagtail_api_router.register_endpoint("pages", PagesAPIViewSet)
wagtail_api_router.register_endpoint("images", ImagesAPIViewSet)
wagtail_api_router.register_endpoint("documents", DocumentsAPIViewSet)

# ─── URL patterns ─────────────────────────────────────────────────────────────

urlpatterns = [
    # Django admin
    path("admin/", admin.site.urls),

    # Wagtail CMS admin
    path("cms/", include(wagtailadmin_urls)),

    # Wagtail documents
    path("documents/", include(wagtaildocs_urls)),

    # Wagtail built-in page / image / document API
    path("api/v2/", wagtail_api_router.urls),

    # ── Custom headless API endpoints ─────────────────────────────────────
    path("api/pages/home/",            HomePageAPIView.as_view(),            name="api-home-page"),

    path("api/properties/",            PropertyListAPIView.as_view(),        name="api-property-list"),
    path("api/properties/<slug:slug>/", PropertyDetailAPIView.as_view(),     name="api-property-detail"),

    path("api/forms/contact/",         ContactFormAPIView.as_view(),         name="api-contact-form"),
    path("api/forms/eoi/",             ExpressionOfInterestAPIView.as_view(), name="api-eoi-form"),

    # Wagtail page serving (headless previews)
    path("", include(wagtail_urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
