import io
from typing import List

from pydantic import BaseModel, Field
from pypdf import PdfReader

from app.llm.base import LLMProvider
from app.schemas.certificate import CertificateCreate
from app.schemas.experience import ExperienceCreate
from app.services.template_service import TemplateService


# Yapay zekanın bize tam olarak bu formatta dönmesini garanti ediyoruz
# (Structured Outputs)
class LinkedInProfileDataSchema(BaseModel):
    experiences: List[ExperienceCreate] = Field(
        description="List of professional work experiences"
    )
    certificates: List[CertificateCreate] = Field(
        description="List of licenses or certifications"
    )


class LinkedInPDFParser:
    @staticmethod
    def extract_raw_text(pdf_bytes: bytes) -> str:
        """PDF dosyasını hafızada açar ve tüm sayfaların metnini birleştirir."""
        raw_text = ""
        try:
            # BytesIO ile diske yazmadan hafızada (in-memory) okuyoruz
            pdf_file = io.BytesIO(pdf_bytes)
            reader = PdfReader(pdf_file)

            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    raw_text += page_text + "\n"

            return raw_text
        except Exception as e:
            raise Exception(f"PDF metni ayıklanırken hata oluştu: {str(e)}")

    @staticmethod
    async def parse_with_llm(
        raw_text: str, llm_provider: LLMProvider
    ) -> LinkedInProfileDataSchema:
        """Ayıklanan ham metni projedeki mevcut
        LLM katmanına gönderip şemaya oturtur."""

        prompt = TemplateService.render_template(
            "prompts/linkedin_pdf_parser.jinja2", raw_text=raw_text
        )

        response = await llm_provider.generate_structured_output(
            prompt=prompt, response_model=LinkedInProfileDataSchema
        )
        return response
