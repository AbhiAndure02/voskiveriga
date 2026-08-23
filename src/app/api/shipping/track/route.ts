import { NextRequest } from 'next/server';
import { ShiprocketService } from '@/services/ShiprocketService';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

/**
 * GET /api/shipping/track
 * Fetch live Shiprocket tracking updates by AWB or order number
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const trackingId = searchParams.get('id') || searchParams.get('awb');

    if (!trackingId) {
      return errorResponse('Tracking ID or AWB Code is required', 'TRACKING_ID_REQUIRED', 400);
    }

    const timeline = await ShiprocketService.getTrackingTimeline(trackingId);

    return successResponse(timeline, 'Tracking timeline fetched successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Tracking details unavailable', 'TRACKING_ERROR', 500);
  }
}
