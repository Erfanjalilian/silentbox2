// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { usersData, type UserRecord as User } from '@/lib/data/users';

// GET - Fetch all users or single user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (id) {
      // Get single user
      const user = usersData.find(u => u.id === id);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(user, { status: 200 });
    }
    
    // Get all users
    return NextResponse.json(usersData, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phoneNumber, role } = body;
    
    // Validate required fields
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'شماره تلفن الزامی است' },
        { status: 400 }
      );
    }
    
    // Check if phone number already exists
    const existingUser = usersData.find(u => u.phoneNumber === phoneNumber);
    if (existingUser) {
      return NextResponse.json(
        { error: 'این شماره تلفن قبلاً ثبت شده است' },
        { status: 400 }
      );
    }
    
    const getTodayDate = () => {
      const today = new Date();
      return today.toLocaleDateString('fa-IR');
    };
    
    const newUser: User = {
      id: String(usersData.length + 1),
      firstName: firstName || '',
      lastName: lastName || '',
      phoneNumber,
      role: role === 'admin' ? 'admin' : 'user',
      createdAt: getTodayDate(),
      updatedAt: getTodayDate(),
    };
    
    usersData.push(newUser);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, firstName, lastName, phoneNumber, role } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const userIndex = usersData.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if phone number already exists for another user
    if (phoneNumber && phoneNumber !== usersData[userIndex].phoneNumber) {
      const existingUser = usersData.find(u => u.phoneNumber === phoneNumber && u.id !== id);
      if (existingUser) {
        return NextResponse.json(
          { error: 'این شماره تلفن قبلاً ثبت شده است' },
          { status: 400 }
        );
      }
    }
    
    const getTodayDate = () => {
      const today = new Date();
      return today.toLocaleDateString('fa-IR');
    };
    
    usersData[userIndex] = {
      ...usersData[userIndex],
      firstName: firstName !== undefined ? firstName : usersData[userIndex].firstName,
      lastName: lastName !== undefined ? lastName : usersData[userIndex].lastName,
      phoneNumber: phoneNumber || usersData[userIndex].phoneNumber,
      role: role || usersData[userIndex].role,
      updatedAt: getTodayDate(),
    };
    
    return NextResponse.json(usersData[userIndex], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const userIndex = usersData.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Prevent deleting the only admin
    const userToDelete = usersData[userIndex];
    if (userToDelete.role === 'admin') {
      const adminCount = usersData.filter(u => u.role === 'admin').length;
      if (adminCount === 1) {
        return NextResponse.json(
          { error: 'نمی‌توان آخرین ادمین را حذف کرد' },
          { status: 400 }
        );
      }
    }
    
    usersData.splice(userIndex, 1);
    
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}