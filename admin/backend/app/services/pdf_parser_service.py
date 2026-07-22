import io
from typing import List

from pydantic import BaseModel, Field
from pypdf import PdfReader

from app.llm.base import LLMProvider
from app.schemas.certificate import CertificateCreate
from app.schemas.experience import ExperienceCreate
from app.services.template_service import TemplateService


# We guarantee that AI returns in this exact format (Structured Outputs)
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
        """Opens the PDF file in memory and merges the text of all pages."""
        MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
        if len(pdf_bytes) > MAX_FILE_SIZE:
            raise ValueError("File size cannot exceed 5MB.")

        if not pdf_bytes.startswith(b"%PDF"):
            raise ValueError("Invalid PDF file. The file must be in PDF format.")

        raw_text = ""
        try:
            # Using BytesIO to read in-memory without writing to disk
            pdf_file = io.BytesIO(pdf_bytes)
            reader = PdfReader(pdf_file)

            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    raw_text += page_text + "\n"

            return raw_text
        except Exception as e:
            raise Exception(f"Error occurred while extracting PDF text: {str(e)}")

    @staticmethod
    async def parse_with_llm(
        raw_text: str, llm_provider: LLMProvider
    ) -> LinkedInProfileDataSchema:
        """Sends the extracted raw text to the project's LLM layer
        and parses it into the schema."""

        prompt = TemplateService.render_template(
            "prompts/linkedin_pdf_parser.jinja2", raw_text=raw_text
        )

        response = await llm_provider.generate_structured_output(
            prompt=prompt, response_model=LinkedInProfileDataSchema
        )
        return response
