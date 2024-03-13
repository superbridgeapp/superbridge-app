#!/bin/bash

echo "VERCEL_ENV: $VERCEL_ENV"
echo "NEXT_PUBLIC_DEDICATED_DEPLOYMENT: $NEXT_PUBLIC_DEDICATED_DEPLOYMENT"

if [[ -z "$NEXT_PUBLIC_DEDICATED_DEPLOYMENT" ]]; then
  # NEXT_PUBLIC_DEDICATED_DEPLOYMENT is empty
  echo "✅ - Build can proceed"
  exit 1;
fi

if [[ "$VERCEL_ENV" == "production" && -n "$NEXT_PUBLIC_DEDICATED_DEPLOYMENT" ]]; then
  # VERCEL_ENV is production and NEXT_PUBLIC_DEDICATED_DEPLOYMENT is not empty
  echo "✅ - Build can proceed"
  exit 1;
fi

# Don't build
echo "🛑 - Build cancelled"
exit 0;
