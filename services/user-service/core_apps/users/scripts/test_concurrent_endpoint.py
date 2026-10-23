import asyncio
import os
import time

import httpx

URL = "http://localhost:8080/api/users/stores-with-owners/"
CONCURRENT_REQUESTS = 10


async def make_request(
    client: httpx.AsyncClient,
    request_number: int,
) -> dict:
    start = time.perf_counter()

    try:
        response = await client.get(URL)
        elapsed = time.perf_counter() - start

        return {
            "request": request_number,
            "status": response.status_code,
            "elapsed_seconds": round(elapsed, 3),
        }
    except httpx.HTTPError as exc:
        return {
            "request": request_number,
            "status": "ERROR",
            "error": str(exc),
        }


async def main() -> None:
    token = os.environ.get("ACCESS_TOKEN")
    if not token:
        raise SystemExit("Set ACCESS_TOKEN in your environment before running.")

    headers = {"Authorization": f"Bearer {token}"}

    total_successful = 0
    total_rate_limited = 0
    total_other_failures = 0

    async with httpx.AsyncClient(headers=headers, timeout=30) as client:
        for batch in range(1, 6):
            print(f"\n--- Batch {batch}/5 ---")

            results = await asyncio.gather(
                *[make_request(client, number) for number in range(1, CONCURRENT_REQUESTS + 1)]
            )

            for result in results:
                print(result)

            total_successful += sum(r["status"] == 200 for r in results)
            total_rate_limited += sum(r["status"] == 429 for r in results)
            total_other_failures += sum(r["status"] != 200 and r["status"] != 429 for r in results)

            if batch < 5:
                await asyncio.sleep(2)

    print("\n--- Final Summary ---")
    print(f"Successful (200): {total_successful}")
    print(f"Rate limited (429): {total_rate_limited}")
    print(f"Other failures: {total_other_failures}")


if __name__ == "__main__":
    asyncio.run(main())
