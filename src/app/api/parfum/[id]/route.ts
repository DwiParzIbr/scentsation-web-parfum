import { NextResponse } from 'next/server';
import { LIST_PARFUM, ParfumItem } from '@/data/parfum';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: `Parfum ${id} berhasil diperbarui`,
      updated: { id, ...body }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    return NextResponse.json({
      success: true,
      message: `Parfum ${id} berhasil dihapus`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
