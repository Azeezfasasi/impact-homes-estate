import {
  getWelcomeCta,
  updateWelcomeCta,
  addStat,
  updateStat,
  deleteStat,
  reorderStats,
} from "../../server/controllers/welcomeCtaController";

// GET WelcomeCta content
export async function GET() {
  try {
    const welcomeCta = await getWelcomeCta();
    return Response.json({ success: true, data: welcomeCta });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update main content or handle stat operations
export async function PUT(req) {
  try {
    const body = await req.json();

    // Handle stat operations
    if (body.action === "addStat") {
      const stat = await addStat(body.statData);
      return Response.json({ success: true, stat });
    }

    if (body.action === "updateStat") {
      const stat = await updateStat(body.statId, body.statData);
      return Response.json({ success: true, stat });
    }

    if (body.action === "deleteStat") {
      const result = await deleteStat(body.statId);
      return Response.json({ success: true, ...result });
    }

    if (body.action === "reorderStats" && Array.isArray(body.statIds)) {
      const reorderedStats = await reorderStats(body.statIds);
      return Response.json({ success: true, stats: reorderedStats });
    }

    // Handle main content update
    const updatedData = await updateWelcomeCta(body);
    return Response.json({ success: true, data: updatedData });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
