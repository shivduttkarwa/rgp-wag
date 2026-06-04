from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve as media_serve
from wagtail import urls as wagtail_urls
from wagtail.admin import urls as wagtailadmin_urls
from wagtail.documents import urls as wagtaildocs_urls
from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.images.api.v2.views import ImagesAPIViewSet
from wagtail.documents.api.v2.views import DocumentsAPIViewSet

from apps.home.api import (
    AboutPageAPIView, ContactPageAPIView, EoiPageAPIView,
    HomePageAPIView, PropertiesPageAPIView, ServicesPageAPIView,
    TeamPageAPIView, TestimonialsPageAPIView,
)
from apps.properties.api import PropertyListAPIView, PropertyDetailAPIView
from apps.forms.api import ContactFormAPIView, ExpressionOfInterestAPIView
from apps.testimonials.api import VideoTestimonialListAPIView, TextTestimonialListAPIView

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
    path("api/pages/contact/",         ContactPageAPIView.as_view(),         name="api-contact-page"),
    path("api/pages/team/",            TeamPageAPIView.as_view(),            name="api-team-page"),
    path("api/pages/properties/",      PropertiesPageAPIView.as_view(),      name="api-properties-page"),
    path("api/pages/about/",           AboutPageAPIView.as_view(),           name="api-about-page"),
    path("api/pages/services/",        ServicesPageAPIView.as_view(),        name="api-services-page"),
    path("api/pages/testimonials/",    TestimonialsPageAPIView.as_view(),    name="api-testimonials-page"),
    path("api/pages/eoi/",             EoiPageAPIView.as_view(),             name="api-eoi-page"),

    path("api/properties/",            PropertyListAPIView.as_view(),        name="api-property-list"),
    path("api/properties/<slug:slug>/", PropertyDetailAPIView.as_view(),     name="api-property-detail"),

    path("api/forms/contact/",         ContactFormAPIView.as_view(),         name="api-contact-form"),
    path("api/forms/eoi/",             ExpressionOfInterestAPIView.as_view(), name="api-eoi-form"),

    path("api/testimonials/video/",    VideoTestimonialListAPIView.as_view(), name="api-video-testimonial-list"),
    path("api/testimonials/text/",     TextTestimonialListAPIView.as_view(),  name="api-text-testimonial-list"),

]

# Serve uploaded media in production (DEBUG=False) for demo hosting.
media_prefix = settings.MEDIA_URL.lstrip("/").rstrip("/")
if media_prefix:
    urlpatterns += [
        re_path(
            rf"^{media_prefix}/(?P<path>.*)$",
            media_serve,
            {"document_root": settings.MEDIA_ROOT},
        ),
    ]

# Wagtail page serving (headless previews) must remain last.
urlpatterns += [
    path("", include(wagtail_urls)),
]
