import { db } from './db';
import { projects, inventories, users, transactions } from './schema';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (optional - be careful in production)
    console.log('🧹 Clearing existing data...');
    await db.delete(transactions);
    await db.delete(inventories);
    await db.delete(projects);
    await db.delete(users);

    // Insert sample users
    console.log('👥 Inserting users...');
    const sampleUsers = await db.insert(users).values([
      {
        id: 'user-1',
        name: 'Ahmad Operator',
        email: 'ahmad@pijar.com',
        role: 'operator',
        username: 'ahmad_op',
        emailVerified: true,
        isAnonymous: false,
      },
      {
        id: 'user-2',
        name: 'Siti Supervisor',
        email: 'siti@pijar.com',
        role: 'supervisor',
        username: 'siti_sup',
        emailVerified: true,
        isAnonymous: false,
      },
      {
        id: 'user-3',
        name: 'Budi Manager',
        email: 'budi@pijar.com',
        role: 'manager',
        username: 'budi_mgr',
        emailVerified: true,
        isAnonymous: false,
      },
    ]).returning();

    // Insert sample projects
    console.log('🏗️ Inserting projects...');
    const sampleProjects = await db.insert(projects).values([
      {
        name: 'Gedung Perkantoran Dinas',
        location: 'Jl. Pembangunan No. 45, Labuhanbatu Selatan',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
      },
      {
        name: 'Jembatan Sungai Barumun',
        location: 'Desa Sejahtera, Kec. Bilah Hilir',
        startDate: '2024-03-01',
        endDate: '2024-10-30',
      },
      {
        name: 'Jalan Raya Tol Akses',
        location: 'Km 15-25 Labuhanbatu Selatan',
        startDate: '2024-02-01',
        endDate: '2025-01-31',
      },
      {
        name: 'Sekolah Dasar Negeri 001',
        location: 'Desa Pendidikan, Kec. Kota Pinang',
        startDate: '2024-04-01',
        endDate: '2024-11-30',
      },
    ]).returning();

    // Insert comprehensive inventories for each project
    console.log('📦 Inserting inventories...');
    const sampleInventories = await db.insert(inventories).values([
      // Gedung Perkantoran Dinas
      {
        projectId: sampleProjects[0].id,
        name: 'Semen Portland Tiga Roda',
        unit: 'Sak (50kg)',
        initialStock: '200',
      },
      {
        projectId: sampleProjects[0].id,
        name: 'Besi Beton 10mm',
        unit: 'Batang (12m)',
        initialStock: '500',
      },
      {
        projectId: sampleProjects[0].id,
        name: 'Besi Beton 12mm',
        unit: 'Batang (12m)',
        initialStock: '300',
      },
      {
        projectId: sampleProjects[0].id,
        name: 'Keramik Lantai 60×60',
        unit: 'Dus (1.44m²)',
        initialStock: '150',
      },
      {
        projectId: sampleProjects[0].id,
        name: 'Cat Tembok Dulux',
        unit: 'Kaleng (25kg)',
        initialStock: '50',
      },
      {
        projectId: sampleProjects[0].id,
        name: 'Pasir Cor',
        unit: 'M³',
        initialStock: '25',
      },
      {
        projectId: sampleProjects[0].id,
        name: 'Batu Split 1-2cm',
        unit: 'M³',
        initialStock: '30',
      },

      // Jembatan Sungai Barumun
      {
        projectId: sampleProjects[1].id,
        name: 'Beton Ready Mix K-300',
        unit: 'M³',
        initialStock: '100',
      },
      {
        projectId: sampleProjects[1].id,
        name: 'Besi Beton 16mm',
        unit: 'Batang (12m)',
        initialStock: '400',
      },
      {
        projectId: sampleProjects[1].id,
        name: 'Besi Beton 19mm',
        unit: 'Batang (12m)',
        initialStock: '200',
      },
      {
        projectId: sampleProjects[1].id,
        name: 'Kawat Bendrat',
        unit: 'Kg',
        initialStock: '100',
      },
      {
        projectId: sampleProjects[1].id,
        name: 'Papan Bekisting',
        unit: 'Lembar (4×8 feet)',
        initialStock: '80',
      },

      // Jalan Raya Tol Akses
      {
        projectId: sampleProjects[2].id,
        name: 'Aspal Hotmix AC-WC',
        unit: 'Ton',
        initialStock: '500',
      },
      {
        projectId: sampleProjects[2].id,
        name: 'Agregat Kasar',
        unit: 'M³',
        initialStock: '200',
      },
      {
        projectId: sampleProjects[2].id,
        name: 'Agregat Halus',
        unit: 'M³',
        initialStock: '150',
      },
      {
        projectId: sampleProjects[2].id,
        name: 'Semen Portland',
        unit: 'Sak (50kg)',
        initialStock: '300',
      },

      // Sekolah Dasar Negeri 001
      {
        projectId: sampleProjects[3].id,
        name: 'Bata Merah Press',
        unit: 'Buah',
        initialStock: '10000',
      },
      {
        projectId: sampleProjects[3].id,
        name: 'Genteng Keramik',
        unit: 'Buah',
        initialStock: '2000',
      },
      {
        projectId: sampleProjects[3].id,
        name: 'Kayu Meranti 5×7',
        unit: 'Batang (4m)',
        initialStock: '100',
      },
      {
        projectId: sampleProjects[3].id,
        name: 'Paku 2-12 inch',
        unit: 'Kg',
        initialStock: '50',
      },
    ]).returning();

    // Insert realistic transactions with varied dates
    console.log('📊 Inserting transactions...');
    
    // Helper function to create date
    const createDate = (daysAgo: number, hour: number = 8, minute: number = 0) => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(hour, minute, 0, 0);
      return date;
    };

    const transactionData = [
      // Gedung Perkantoran - Recent activity
      {
        projectId: sampleProjects[0].id,
        inventoryId: sampleInventories[0].id, // Semen
        userId: sampleUsers[0].id,
        type: 'in',
        quantity: '100',
        unit: 'Sak (50kg)',
        notes: 'Pengiriman dari PT Semen Indonesia',
        createdAt: createDate(5, 8, 30),
      },
      {
        projectId: sampleProjects[0].id,
        inventoryId: sampleInventories[0].id, // Semen
        userId: sampleUsers[0].id,
        type: 'out',
        quantity: '50',
        unit: 'Sak (50kg)',
        notes: 'Untuk pengecoran lantai 1',
        createdAt: createDate(3, 10, 15),
      },
      {
        projectId: sampleProjects[0].id,
        inventoryId: sampleInventories[1].id, // Besi 10mm
        userId: sampleUsers[1].id,
        type: 'in',
        quantity: '200',
        unit: 'Batang (12m)',
        notes: 'Pengiriman dari supplier lokal',
        createdAt: createDate(4, 14, 0),
      },
      {
        projectId: sampleProjects[0].id,
        inventoryId: sampleInventories[1].id, // Besi 10mm
        userId: sampleUsers[0].id,
        type: 'out',
        quantity: '80',
        unit: 'Batang (12m)',
        notes: 'Untuk struktur kolom lantai 1',
        createdAt: createDate(2, 9, 45),
      },
      {
        projectId: sampleProjects[0].id,
        inventoryId: sampleInventories[3].id, // Keramik
        userId: sampleUsers[0].id,
        type: 'out',
        quantity: '25',
        unit: 'Dus (1.44m²)',
        notes: 'Pemasangan lantai ruang meeting',
        createdAt: createDate(1, 11, 30),
      },

      // Jembatan Sungai - Ongoing work
      {
        projectId: sampleProjects[1].id,
        inventoryId: sampleInventories[7].id, // Beton Ready Mix
        userId: sampleUsers[1].id,
        type: 'in',
        quantity: '50',
        unit: 'M³',
        notes: 'Pengiriman untuk pondasi jembatan',
        createdAt: createDate(6, 7, 0),
      },
      {
        projectId: sampleProjects[1].id,
        inventoryId: sampleInventories[7].id, // Beton Ready Mix
        userId: sampleUsers[0].id,
        type: 'out',
        quantity: '30',
        unit: 'M³',
        notes: 'Pengecoran pondasi pier 1',
        createdAt: createDate(5, 6, 30),
      },
      {
        projectId: sampleProjects[1].id,
        inventoryId: sampleInventories[8].id, // Besi 16mm
        userId: sampleUsers[0].id,
        type: 'out',
        quantity: '100',
        unit: 'Batang (12m)',
        notes: 'Tulangan pondasi pier 1',
        createdAt: createDate(6, 13, 20),
      },

      // Jalan Tol - Large scale operations
      {
        projectId: sampleProjects[2].id,
        inventoryId: sampleInventories[12].id, // Aspal
        userId: sampleUsers[2].id,
        type: 'in',
        quantity: '100',
        unit: 'Ton',
        notes: 'Pengiriman aspal untuk segmen 1',
        createdAt: createDate(7, 5, 0),
      },
      {
        projectId: sampleProjects[2].id,
        inventoryId: sampleInventories[12].id, // Aspal
        userId: sampleUsers[1].id,
        type: 'out',
        quantity: '75',
        unit: 'Ton',
        notes: 'Pengaspalan km 15-18',
        createdAt: createDate(6, 6, 0),
      },

      // Sekolah - Building construction
      {
        projectId: sampleProjects[3].id,
        inventoryId: sampleInventories[16].id, // Bata Merah
        userId: sampleUsers[0].id,
        type: 'out',
        quantity: '2000',
        unit: 'Buah',
        notes: 'Pembangunan dinding kelas 1-3',
        createdAt: createDate(8, 8, 0),
      },
      {
        projectId: sampleProjects[3].id,
        inventoryId: sampleInventories[18].id, // Kayu Meranti
        userId: sampleUsers[0].id,
        type: 'out',
        quantity: '20',
        unit: 'Batang (4m)',
        notes: 'Rangka atap ruang kelas',
        createdAt: createDate(7, 10, 30),
      },

      // Recent transactions for today's testing
      {
        projectId: sampleProjects[0].id,
        inventoryId: sampleInventories[0].id, // Semen
        userId: sampleUsers[0].id,
        type: 'in',
        quantity: '25',
        unit: 'Sak (50kg)',
        notes: 'Pengiriman tambahan untuk finishing',
        createdAt: createDate(0, 8, 0), // Today morning
      },
      {
        projectId: sampleProjects[1].id,
        inventoryId: sampleInventories[8].id, // Besi 16mm
        userId: sampleUsers[1].id,
        type: 'out',
        quantity: '50',
        unit: 'Batang (12m)',
        notes: 'Tulangan deck jembatan',
        createdAt: createDate(0, 10, 30), // Today mid-morning
      },
      {
        projectId: sampleProjects[0].id,
        inventoryId: sampleInventories[3].id, // Keramik
        userId: sampleUsers[0].id,
        type: 'out',
        quantity: '15',
        unit: 'Dus (1.44m²)',
        notes: 'Pemasangan lantai ruang direktur',
        createdAt: createDate(0, 13, 15), // Today afternoon
      },
      {
        projectId: sampleProjects[2].id,
        inventoryId: sampleInventories[15].id, // Semen Portland
        userId: sampleUsers[2].id,
        type: 'in',
        quantity: '100',
        unit: 'Sak (50kg)',
        notes: 'Pengiriman untuk base course',
        createdAt: createDate(0, 14, 45), // Today late afternoon
      },
      {
        projectId: sampleProjects[3].id,
        inventoryId: sampleInventories[16].id, // Bata Merah
        userId: sampleUsers[0].id,
        type: 'out',
        quantity: '500',
        unit: 'Buah',
        notes: 'Pembangunan dinding perpustakaan',
        createdAt: createDate(0, 15, 30), // Today evening
      },
    ];

    await db.insert(transactions).values(transactionData);

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Seeded data summary:`);
    console.log(`   - Users: ${sampleUsers.length}`);
    console.log(`   - Projects: ${sampleProjects.length}`);
    console.log(`   - Inventories: ${sampleInventories.length}`);
    console.log(`   - Transactions: ${transactionData.length}`);

    return {
      success: true,
      data: {
        users: sampleUsers.length,
        projects: sampleProjects.length,
        inventories: sampleInventories.length,
        transactions: transactionData.length,
      }
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}