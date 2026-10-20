import requests
from django.conf import settings

TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_URL = "https://image.tmdb.org/t/p"
TIMEOUT = 5

class TMDBError(Exception):
    """Raised when TMDB can't be reached or returns bad data."""

class TMDBNotFound(TMDBError):
    pass

_session = requests.Session()
_session.headers.update({
    "Authorization": f"Bearer {settings.TMDB_ACCESS_TOKEN}",
    "accept": "application/json",
})

def _get(path, params=None):
    try:
        resp = _session.get(f"{TMDB_BASE_URL}{path}", params=params, timeout=TIMEOUT)
        if resp.status_code == 404:
            raise TMDBNotFound(path)
        resp.raise_for_status()
        return resp.json()
    except TMDBError:
        raise
    except (requests.RequestException, ValueError) as exc:
        raise TMDBError(str(exc)) from exc

def _image(path, size="w185"):
    return f"{TMDB_IMAGE_URL}/{size}{path}" if path else None

def _year(date):
    return date[:4] if date else None

def serialize_show_summary(show):
    return {
        "tmdb_id": show["id"],
        "name": show.get("name"),
        "year": _year(show.get("first_air_date")),
        "image": _image(show.get("poster_path")),
    }

def serialize_show_detail(show):
    last_ep = show.get("last_episode_to_air") or {}
    runtime = (show.get("episode_run_time") or [None])[0] or last_ep.get("runtime")

    return {
        "tmdb_id": show["id"],
        "name": show.get("name"),
        "tagline": show.get("tagline") or None,
        "summary": show.get("overview") or None,
        "year": _year(show.get("first_air_date")),
        "end_year": _year(show.get("last_air_date")) if not show.get("in_production") else None,
        "status": show.get("status"),
        "language": show.get("original_language"),
        "runtime": runtime,
        "genres": [g["name"] for g in show.get("genres", [])],
        "networks": [n["name"] for n in show.get("networks", [])],
        "number_of_seasons": show.get("number_of_seasons"),
        "number_of_episodes": show.get("number_of_episodes"),
        "rating": round(show["vote_average"], 1) if show.get("vote_count") else None,
        "homepage": show.get("homepage") or None,
        "image": _image(show.get("poster_path"), "w500"),
        "backdrop": _image(show.get("backdrop_path"), "w1280"),
        "seasons": [
            {
                "season_number": s["season_number"],
                "name": s.get("name"),
                "episode_count": s.get("episode_count"),
                "year": _year(s.get("air_date")),
                "image": _image(s.get("poster_path")),
            }
            for s in show.get("seasons", [])
            if s.get("season_number", 0) > 0  # skip "Specials"
        ],
    }

def search_shows(query):
    data = _get("/search/tv", {"query": query})
    return [
        serialize_show_summary(s)
        for s in data.get("results", [])
        if s.get("id") is not None
    ]

def get_show(tmdb_id):
    return serialize_show_detail(_get(f"/tv/{tmdb_id}"))
