WITH distance_calculations AS (
    SELECT
        id,
        timestamp,
        "deviceId",
        latitude,
        longitude,
        altitude,
        hdop,
        LAG(latitude) OVER (
            PARTITION BY "deviceId"
            ORDER BY
                timestamp
        ) AS prev_latitude,
        LAG(longitude) OVER (
            PARTITION BY "deviceId"
            ORDER BY
                timestamp
        ) AS prev_longitude,
        LAG(timestamp) OVER (
            PARTITION BY "deviceId"
            ORDER BY
                timestamp
        ) AS prev_timestamp
    FROM
        "DeviceGPSDatapoint"
),
distance_filtered AS (
    SELECT
        *,
        CASE
            WHEN prev_latitude IS NOT NULL
            AND prev_longitude IS NOT NULL
            AND prev_timestamp IS NOT NULL THEN ST_DistanceSphere(
                ST_MakePoint(longitude, latitude),
                ST_MakePoint(prev_longitude, prev_latitude)
            ) / EXTRACT(
                EPOCH
                FROM
                    (timestamp - prev_timestamp)
            )
            ELSE NULL
        END AS speed
    FROM
        distance_calculations
)
SELECT
    *
FROM
    distance_filtered
WHERE
    OR speed > 40 -- maximum speed in meters per second
