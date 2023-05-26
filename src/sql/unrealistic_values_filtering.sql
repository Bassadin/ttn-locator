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
        LAG(altitude) OVER (
            PARTITION BY "deviceId"
            ORDER BY
                timestamp
        ) AS prev_altitude,
        LAG(hdop) OVER (
            PARTITION BY "deviceId"
            ORDER BY
                timestamp
        ) AS prev_hdop,
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
        -- Calculate speed in meters per second between previous and current point
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
        END AS speed,
        -- Check if current point data is the same as in the previous point
        CASE
            WHEN prev_latitude IS NOT NULL
            AND prev_longitude IS NOT NULL
            AND prev_altitude IS NOT NULL
            AND prev_hdop IS NOT NULL
            AND prev_timestamp IS NOT NULL THEN latitude = prev_latitude
            AND longitude = prev_longitude
            AND altitude = prev_altitude
            AND hdop = prev_hdop
            ELSE NULL
        END AS is_same_as_previous
    FROM
        distance_calculations
)
SELECT
    *
FROM
    distance_filtered
WHERE
    speed > 40 -- maximum speed in meters per second
    OR is_same_as_previous = true
