import os

from jinja2 import Environment, FileSystemLoader

# Get the base directory path for templates
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")


class TemplateService:
    _env = None

    @classmethod
    def get_env(cls) -> Environment:
        if cls._env is None:
            cls._env = Environment(
                loader=FileSystemLoader(TEMPLATES_DIR),
                autoescape=False,  # Rendering raw Markdown, no HTML autoescape
            )
        return cls._env

    @classmethod
    def get_template_content(cls, template_path: str) -> str:
        """
        Reads a jinja2 template file and returns its raw string content.
        This is useful for LangChain PromptTemplate since it expects a string.
        """
        env = cls.get_env()
        # Read the raw source code of the template
        source, _, _ = env.loader.get_source(env, template_path)
        return source

    @classmethod
    def render_template(cls, template_path: str, **kwargs) -> str:
        """
        Renders a jinja2 template directly with given variables.
        """
        env = cls.get_env()
        template = env.get_template(template_path)
        return template.render(**kwargs)
