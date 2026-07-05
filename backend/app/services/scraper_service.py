import logging

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


class ScraperService:
    @staticmethod
    async def scrape_job_description(url: str) -> str:
        """
        Fetches the HTML content of a given URL and extracts the visible text.
        Useful for reading job descriptions.
        """
        try:
            headers = {
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/91.0.4472.124 Safari/537.36"
                )
            }
            async with httpx.AsyncClient(
                headers=headers, follow_redirects=True, timeout=15.0
            ) as client:
                response = await client.get(url)
                response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            # Remove scripts and styles
            for script in soup(
                ["script", "style", "noscript", "header", "footer", "nav"]
            ):
                script.extract()

            text = soup.get_text(separator="\n", strip=True)

            # Basic cleanup of multiple empty lines
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            cleaned_text = "\n".join(lines)

            return cleaned_text
        except Exception as e:
            logger.error(f"Failed to scrape {url}: {str(e)}")
            raise ValueError(
                f"Failed to extract job description from {url}. Error: {str(e)}"
            )
