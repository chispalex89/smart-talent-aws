const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: 'pablo@godoy.com',
        password:
          '$2b$10$B/U.J1kVxGq40k.HGWabHuwHKnMndwGK0JV4FVwDNSMa/Azh3eKUq',
        firstName: 'Pablo',
        middleName: 'Alejandro',
        lastName: 'Godoy',
        secondLastName: 'Díaz',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
        status: 'active',
      },
      {
        email: 'alejandro@diaz.com',
        password:
          '$2b$10$B/U.J1kVxGq40k.HGWabHuwHKnMndwGK0JV4FVwDNSMa/Azh3eKUq',
        firstName: 'Pablo',
        middleName: 'Alejandro',
        lastName: 'Godoy',
        secondLastName: 'Díaz',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
        status: 'active',
      },
      {
        id: 3,
        firstName: 'Kenneth',
        middleName: 'André',
        lastName: 'Martínez',
        secondLastName: 'Molina',
        marriedLastName: null,
        email: 'kenneth@martinez.com',
        status: 'active',
        password:
          '$2b$10$5nahPSvQsBM0dE5mpeyHGOXwfik9bS55/FlpCMf69XYBnhIMfY0Nu',
        isDeleted: false,
        created_at: '2025-01-15T17:22:55.255Z',
        updated_At: '2025-01-15T17:22:55.256Z',
        created_by: 'system',
      },
    ],
  });

  await prisma.role.createMany({
    data: [
      {
        name: 'Admin',
        description: 'Administrador del sistema',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Recruiter',
        description: 'Reclutador de la empresa',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Applicant',
        description: 'Aplicante de empleo',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      }
    ],
  });

  await prisma.userRole.createMany({
    data: [
      {
        userId: 1,
        roleId: 2,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        userId: 2,
        roleId: 3,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        userId: 3,
        roleId: 2,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.documentType.createMany({
    data: [
      {
        name: 'DPI',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Passport',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.gender.createMany({
    data: [
      {
        name: 'Masculino',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Femenino',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Otro',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.maritalStatus.createMany({
    data: [
      {
        name: 'Soltero/a',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Casado/a',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Divorciado/a',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Unido/a',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Viudo/a',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.country.createMany({
    data: [
      {
        name: 'Guatemala',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.state.createMany({
    data: [
      {
        name: 'Guatemala',
        countryId: 1,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Baja Verapaz',
        countryId: 1,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Alta Verapaz',
        countryId: 1,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.city.createMany({
    data: [
      {
        name: 'Guatemala',
        stateId: 1,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Mixco',
        stateId: 1,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Villa Nueva',
        stateId: 1,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Petapa',
        stateId: 1,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Salamá',
        stateId: 2,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Cobán',
        stateId: 3,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.zone.createMany({
    data: [
      {
        name: 'Zona 1',
        cityId: 1,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Zona 2',
        cityId: 1,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Zona 1',
        cityId: 2,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Zona 0',
        cityId: 3,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },

      {
        name: 'Zona 1',
        cityId: 4,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Zona 0',
        cityId: 5,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Zona 1',
        cityId: 6,
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.driverLicense.createMany({
    data: [
      {
        name: 'A',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'B',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'C',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'M',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.academicLevel.createMany({
    data: [
      {
        name: 'Primaria',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Secundaria',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Universitaria',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.profession.createMany({
    data: [
      {
        name: 'Ingeniero',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Doctor',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Abogado',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.jobHierarchy.createMany({
    data: [
      {
        name: 'Gerente',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Supervisor',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Empleado',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.employmentStatus.createMany({
    data: [
      {
        name: 'Trabajando actualmente',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Desempleado',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.employmentSector.createMany({
    data: [
      {
        name: 'Agricultura',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Comercio',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Construcción',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Educación',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Finanzas',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Gobierno',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Industria',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Salud',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Servicios',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Turismo',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.salaryRange.createMany({
    data: [
      {
        range: 'Q3000 - Q5000',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        range: 'Q5000 - Q7000',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        range: 'Q7000 - Q9000',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        range: 'Q9000 - Q11000',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        range: 'Q11000 o más',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.workShift.createMany({
    data: [
      {
        name: 'Matutino',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Vespertino',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Nocturno',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Mixto',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Rotativo',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Fines de semana',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.contractType.createMany({
    data: [
      {
        name: 'Indefinido',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Temporal',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Por proyecto',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Por hora',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.genderPreference.createMany({
    data: [
      {
        name: 'Masculino',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Femenino',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Indiferente',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.membershipType.createMany({
    data: [
      {
        name: 'Bronce',
        price: 0,
        created_by: 'seed',
        created_at: new Date(),
        features: [
          'Publicar ofertas de empleo ilimitadas',
          'Tus ofertas de empleo se publicarán de inmediato',
          'Tus ofertas de empleo serán publicadas en las primeras posiciones (por encima de los gratuitos).',
          'Tus ofertas de empleo pueden ser confidenciales si asi lo deseas.',
          'Buscar candidatos en la base de datos (Con acceso a sus datos básicos y descarga de Currículos).',
          'Filtros para organizar los candidatos que aplicaron a tus ofertas laborales publicadas.',
          'Tendrás derecho a anunciar 3 ofertas de empleo como destacadas.',
          'Nombre y logo de tu empresa.',
        ],
        isDeleted: false,
      },
      {
        name: 'Plata',
        price: 160.00,
        created_by: 'seed',
        created_at: new Date(),
        features: [
          'Publicar ofertas de empleo ilimitadas',
          'Tus ofertas de empleo se publicarán de inmediato',
          'Tus ofertas de empleo serán publicadas en las primeras posiciones (por encima de los gratuitos).',
          'Tus ofertas de empleo pueden ser confidenciales si así lo deseas.',
          'Recibir currículos completos y en cantidad ilimitada de los candidatos que aplicaron a tu oferta de empleo.',
          'Buscar candidatos en la base de datos (Con acceso a sus datos básicos y descarga de Currículo).',
          'Filtros para organizar los candidatos que aplicaron a tus ofertas laborales publicadas.',
          'Tendrás derecho a anunciar 10 ofertas de empleo como destacadas.',
          '1 anuncio al mes de publicidad de tus ofertas de empleos en el Facebook de Smart Talent.',
          'Nombre y logo de tu empresa.',
        ],
        isDeleted: false,
      },
      {
        name: 'Oro',
        price: 215.00,
        created_by: 'seed',
        created_at: new Date(),
        features: [
          'Publicar ofertas de empleo ilimitadas',
          'Tus ofertas de empleo se publicarán de inmediato',
          'Tus ofertas de empleo serán publicadas en las primeras posiciones (por encima de los gratuitos).',
          'Tus ofertas de empleo pueden ser confidenciales si así lo deseas.',
          'Recibir currículos completos y en cantidad ilimitada de los candidatos que aplicaron a tu oferta de empleo.',
          'Buscar candidatos en la base de datos (Con acceso a los datos básicos del contacto y descarga de Currículos).',
          'Filtros para organizar los candidatos que aplicaron a tus ofertas laborales publicadas.',
          'Tendrás derecho a anunciar todas ofertas de empleo como destacadas.',
          '3 anuncios al mes de publicidad de tus ofertas de empleo en el Facebook de Smart Talent (1 anuncio por semana).',
          'Nombre y logo de tu empresa.',
        ],
        isDeleted: false,
      },
    ],
  });

  await prisma.softwareSkills.createMany({
    data: [
      {
        name: 'Word',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Excel',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Power Point',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Outlook',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Internet',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Redes Sociales',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Programación',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.language.createMany({
    data: [
      {
        name: 'Español',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Inglés',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Francés',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Alemán',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Italiano',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Portugués',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Chino',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.skillLevel.createMany({
    data: [
      {
        name: 'Básico',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Intermedio',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
      {
        name: 'Avanzado',
        created_by: 'seed',
        created_at: new Date(),
        isDeleted: false,
      },
    ],
  });

  await prisma.company.create({
    data: {
      name: 'Empresa de Prueba',
      countryId: 1,
      employmentSectorId: 1,
      active: true,
      created_by: 'seed',
      description: 'Descripción de la empresa de prueba',
      isDeleted: false,
      phone: '12345678',
      taxId: '123456789',
    },
  });

  await prisma.recruiter.createMany({
    data: [
      {
        userId: 1,
        companyId: 1,
        created_by: 'seed',
      },
      {
        userId: 3,
        companyId: 1,
        created_by: 'seed',
      }
    ]
  })

  await prisma.jobOffer.create({
    data: {
      ageRangeFrom: 18,
      ageRangeTo: 30,
      professionId: 1,
      jobHierarchyId: 1,
      employmentSectorId: 1,
      salaryRangeId: 1,
      workShiftId: 1,
      contractTypeId: 1,
      cityId: 1,
      companyId: 1,
      countryId: 1,
      created_by: 'seed',
      description: 'Descripción de la oferta de trabajo',
      featured: false,
      publicDescription: null,
      genderPreferenceId: 1,
      hiringDate: new Date(),
      isConfidential: false,
      isExperienceRequired: false,
      languageSkills: {},
      mainLanguageId: 1,
      maritalStatusId: 1,
      minimumAcademicLevelId: 1,
      name: 'Oferta de trabajo de prueba',
      otherLanguages: {},
      publicationDate: new Date(),
      receivesResumesByEmail: false,
      status: 'active',
      requiredAvailabilityToTravel: false,
      requiredDriverLicense: false,
      schedule: 'Lunes a Viernes',
      softwareSkills: {},
      stateId: 1,
      uuid: '123456789',
      vacancies: 5,
    },
  });

  await prisma.applicant.createMany({
    data: [
      {
        userId: 2,
        created_by: 'seed',
      },
    ],
  });

  await prisma.personalData.createMany({
    data: [
      {
        applicantId: 1,
        address: 'Ciudad de Guatemala',
        availabilityToTravel: false,
        countryOfResidencyId: 1,
        created_by: 'seed',
        documentId: '123456789',
        documentTypeId: 1,
        genderId: 1,
        maritalStatusId: 1,
        driverLicenseId: 1,
        mobile: '12345678',
        phone: '12345679',
      },
    ],
  });

  await prisma.academicData.createMany({
    data: [
      {
        applicantId: 1,
        created_by: 'seed',
        nativeEnglish: false,
        nativeSpanish: true,
        otherKnowledgeDescription: 'Conocimientos varios',
        otherLanguages: {},
        softwareKnowledge: {},
      },
    ],
  });

  await prisma.professionalData.createMany({
    data: [
      {
        applicantId: 1,
        created_by: 'seed',
        description: 'Descripción de la experiencia laboral',
        lastAcademicLevelId: 1,
        lastJobHierarchyId: 1,
        professionId: 1,
      },
    ],
  });

  await prisma.companyFavoriteApplicant.createMany({
    data: [
      {
        companyId: 1,
        applicantId: 1,
        created_by: 'seed',
      },
    ],
  });

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
