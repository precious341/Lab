/**
 * Curated educational medical terminology dataset for common laboratory tests.
 * Every supported test uses its full, un-abbreviated medical name as canonicalName
 * and lists its common clinical abbreviation separately.
 * Explanations are strictly educational and never diagnostic or prescriptive.
 */

export const TEST_DEFINITIONS = [
  {
    id: 'hemoglobin',
    canonicalName: 'Hemoglobin',
    abbreviation: 'Hb / Hgb',
    panel: 'Complete Blood Count (CBC)',
    aliases: ['hemoglobin', 'haemoglobin', 'hgb', 'hb'],
    expectedUnits: ['g/dL', 'g/L', 'mmol/L'],
    criticalThresholds: {
      'g/dl': { low: 7.0, high: 20.0 },
      'g/l': { low: 70, high: 200 },
    },
    whatItMeasures:
      'Hemoglobin is a protein found inside red blood cells that carries oxygen from your lungs to tissues and organs throughout your body.',
    whyItMatters:
      'Healthcare professionals request hemoglobin measurements to evaluate oxygen-carrying capacity, screen for anemia, or check for elevated red blood cell concentrations.',
    aboveRangeMeaning:
      'Higher-than-typical hemoglobin can occur with dehydration (more concentrated blood), living at high altitude, smoking, or conditions that cause the body to produce extra red blood cells.',
    belowRangeMeaning:
      'Lower hemoglobin can occur for several reasons, including iron or vitamin deficiencies, recent or ongoing blood loss, reduced red blood cell production, or chronic inflammatory conditions.',
    balancedTakeaway:
      'This result alone cannot establish the underlying cause. A healthcare professional typically interprets hemoglobin alongside your hematocrit, red blood cell indices (such as MCV), medical history, and symptoms.',
    doctorQuestions: [
      'How does my hemoglobin compare with my previous blood counts?',
      'Should my iron stores (ferritin), vitamin B12, or folate levels also be checked?',
      'Could hydration or recent physical factors have influenced this reading?',
    ],
    rangeVariationNote:
      'Reference intervals commonly differ by biological sex, age, pregnancy status, altitude, and the laboratory analyzer used.',
    urgentGuidanceNote:
      'Very low hemoglobin levels—especially alongside shortness of breath, chest discomfort, dizziness, or fainting—warrant prompt medical evaluation.',
  },
  {
    id: 'hematocrit',
    canonicalName: 'Hematocrit',
    abbreviation: 'Hct / PCV',
    panel: 'Complete Blood Count (CBC)',
    aliases: ['hematocrit', 'hct', 'pcv', 'packed cell volume'],
    expectedUnits: ['%', 'L/L'],
    criticalThresholds: {
      '%': { low: 21, high: 60 },
    },
    whatItMeasures:
      'Hematocrit measures the percentage of your total blood volume made up of red blood cells.',
    whyItMatters:
      'Clinicians review hematocrit alongside hemoglobin and red blood cell count to assess hydration status, anemia, or increased red cell mass.',
    aboveRangeMeaning:
      'An elevated hematocrit often reflects reduced plasma fluid (such as dehydration) or increased red blood cell production from high altitude or respiratory factors.',
    belowRangeMeaning:
      'A lower hematocrit generally parallels lower hemoglobin and can relate to nutritional deficiencies, blood loss, or increased fluid volume.',
    balancedTakeaway:
      'Because hematocrit is a percentage of blood volume, temporary hydration changes can shift it slightly. Your clinician evaluates it together with the full blood count.',
    doctorQuestions: [
      'Does my hematocrit align with my hemoglobin and red blood cell count?',
      'Could my hydration status at the time of the blood draw explain this result?',
    ],
    rangeVariationNote:
      'Normal ranges vary by age, biological sex, pregnancy, and hydration state at the time of the blood draw.',
    urgentGuidanceNote:
      'Markedly abnormal values accompanied by weakness, rapid heartbeat, or breathlessness should be discussed promptly with a clinician.',
  },
  {
    id: 'wbc',
    canonicalName: 'White Blood Cell Count',
    abbreviation: 'WBC',
    panel: 'Complete Blood Count (CBC)',
    aliases: ['white blood cell', 'white blood cells', 'wbc', 'leukocytes', 'wbc count', 'total wbc', 'white blood cell count'],
    expectedUnits: ['10^3/uL', 'K/uL', 'x10^9/L', '10*3/uL', '/uL', 'cells/uL'],
    criticalThresholds: {
      '10^3/ul': { low: 1.5, high: 50.0 },
    },
    whatItMeasures:
      'White blood cells are immune system cells that circulate in your bloodstream to help defend the body against infections and tissue inflammation.',
    whyItMatters:
      'Measuring total white blood cells helps clinicians check how your immune system is responding to infections, physical stress, inflammation, or certain medications.',
    aboveRangeMeaning:
      'An elevated white blood cell count commonly happens when the immune system responds to an infection, inflammation, intense exercise, stress, or medications such as corticosteroids.',
    belowRangeMeaning:
      'A lower white blood cell count can occur during or after certain viral infections, nutritional deficiencies, autoimmune factors, or medications that affect bone marrow production.',
    balancedTakeaway:
      'Total WBC count is a broad signal rather than a specific diagnosis. Clinicians often look at the white blood cell differential (neutrophils, lymphocytes, etc.) and your current symptoms.',
    doctorQuestions: [
      'Are any specific white blood cell subtypes (such as neutrophils or lymphocytes) elevated or low?',
      'Could a recent cold, medication, or physical stress explain this count?',
      'Should this test be repeated after recovery to confirm it returns to baseline?',
    ],
    rangeVariationNote:
      'Reference intervals vary across laboratories and differ for infants, children, pregnant individuals, and adults.',
    urgentGuidanceNote:
      'Very high or very low white blood cell counts, particularly with fever, chills, or persistent fatigue, require timely medical attention.',
  },
  {
    id: 'rbc',
    canonicalName: 'Red Blood Cell Count',
    abbreviation: 'RBC',
    panel: 'Complete Blood Count (CBC)',
    aliases: ['red blood cell', 'red blood cells', 'rbc', 'erythrocytes', 'rbc count', 'red blood cell count'],
    expectedUnits: ['10^6/uL', 'M/uL', 'x10^12/L', '10*6/uL'],
    whatItMeasures:
      'Red Blood Cell Count measures the total number of oxygen-carrying red blood cells present in a given volume of your blood.',
    whyItMatters:
      'Clinicians interpret RBC count together with hemoglobin, hematocrit, and cell size indices to evaluate overall red blood cell production and turnover.',
    aboveRangeMeaning:
      'Higher RBC counts can result from dehydration, living at high altitude, smoking, or physiological signals that stimulate red cell production.',
    belowRangeMeaning:
      'Lower RBC counts can happen with reduced red cell production, nutritional deficiencies, blood loss, or chronic health conditions.',
    balancedTakeaway:
      'RBC count is most informative when read as part of the full Complete Blood Count rather than in isolation.',
    doctorQuestions: [
      'How do my RBC count, hemoglobin, and MCV fit together?',
      'Are any follow-up nutritional or iron studies recommended?',
    ],
    rangeVariationNote:
      'Expected intervals vary by biological sex, age, altitude, and laboratory methodology.',
    urgentGuidanceNote:
      'Discuss significant deviations with your healthcare provider, especially if you notice new fatigue or shortness of breath.',
  },
  {
    id: 'platelets',
    canonicalName: 'Platelet Count',
    abbreviation: 'PLT',
    panel: 'Complete Blood Count (CBC)',
    aliases: ['platelet', 'platelets', 'plt', 'platelet count', 'thrombocytes'],
    expectedUnits: ['10^3/uL', 'K/uL', 'x10^9/L', '10*3/uL'],
    criticalThresholds: {
      '10^3/ul': { low: 20, high: 1000 },
    },
    whatItMeasures:
      'Platelets are tiny cell fragments in your blood that clump together to form clots and stop bleeding when blood vessels are injured.',
    whyItMatters:
      'Clinicians check platelet counts to evaluate clotting readiness, investigate unexplained bruising or bleeding, or monitor inflammatory and bone marrow responses.',
    aboveRangeMeaning:
      'Higher platelet counts frequently occur as a temporary reaction to inflammation, recent infection, iron deficiency, surgery, or physical stress.',
    belowRangeMeaning:
      'Lower platelet counts can result from recent viral illnesses, medication effects, immune-mediated clearance, or occasionally specimen clumping in the collection tube.',
    balancedTakeaway:
      'Mild platelet variations are often temporary or reactive. Your doctor considers trends over time and whether you have noticed easy bruising or bleeding.',
    doctorQuestions: [
      'Could a recent illness or current medication be affecting my platelet count?',
      'Does a borderline result simply need a repeat blood draw to check the trend?',
    ],
    rangeVariationNote:
      'Laboratory intervals can vary slightly depending on automated hematology analyzers and specimen handling.',
    urgentGuidanceNote:
      'Extremely low platelet counts or unexpected bleeding, frequent nosebleeds, or widespread bruising warrant urgent medical care.',
  },
  {
    id: 'mcv',
    canonicalName: 'Mean Corpuscular Volume',
    abbreviation: 'MCV',
    panel: 'Complete Blood Count (CBC)',
    aliases: ['mcv', 'mean corpuscular volume'],
    expectedUnits: ['fL'],
    whatItMeasures:
      'Mean Corpuscular Volume measures the average physical size (volume) of your individual red blood cells.',
    whyItMatters:
      'Cell size gives clinicians helpful clues about how red blood cells are being formed, especially when reviewed alongside hemoglobin.',
    aboveRangeMeaning:
      'Larger-than-average red blood cells (higher MCV) are commonly linked with vitamin B12 or folate deficiency, liver factors, thyroid shifts, or alcohol use.',
    belowRangeMeaning:
      'Smaller-than-average red blood cells (lower MCV) most commonly occur with reduced iron stores or inherited hemoglobin traits such as thalassemia trait.',
    balancedTakeaway:
      'MCV is a supporting measurement that helps narrow down possibilities when evaluating hemoglobin and overall blood health.',
    doctorQuestions: [
      'Given my MCV, would checking ferritin, vitamin B12, or folate be useful?',
      'Is this value significant if my hemoglobin is within the reference interval?',
    ],
    rangeVariationNote:
      'Reference ranges can differ modestly between laboratories and age groups.',
    urgentGuidanceNote:
      'MCV is typically interpreted alongside iron, vitamin B12, folate, and full blood count results during a clinician visit.',
  },
  {
    id: 'mch',
    canonicalName: 'Mean Corpuscular Hemoglobin',
    abbreviation: 'MCH',
    panel: 'Complete Blood Count (CBC)',
    aliases: ['mch', 'mean corpuscular hemoglobin'],
    expectedUnits: ['pg'],
    whatItMeasures:
      'Mean Corpuscular Hemoglobin estimates the average weight of hemoglobin protein carried inside each individual red blood cell.',
    whyItMatters:
      'It provides supporting detail about red blood cell composition alongside MCV and overall hemoglobin.',
    aboveRangeMeaning:
      'Higher MCH usually follows larger red blood cell size (elevated MCV), such as with vitamin B12 or folate shortfalls.',
    belowRangeMeaning:
      'Lower MCH typically accompanies smaller red blood cells (low MCV) or reduced iron availability.',
    balancedTakeaway:
      'MCH rarely leads to action by itself; clinicians use it together with hemoglobin and MCV.',
    doctorQuestions: [
      'Does my MCH simply mirror my MCV and hemoglobin findings?',
    ],
    rangeVariationNote:
      'Minor variations exist across hematology instruments and patient age groups.',
    urgentGuidanceNote:
      'Review alongside MCV and hemoglobin with your healthcare professional.',
  },
  {
    id: 'mchc',
    canonicalName: 'Mean Corpuscular Hemoglobin Concentration',
    abbreviation: 'MCHC',
    panel: 'Complete Blood Count (CBC)',
    aliases: ['mchc', 'mean corpuscular hemoglobin concentration'],
    expectedUnits: ['g/dL', '%'],
    whatItMeasures:
      'MCHC measures how densely hemoglobin is packed inside your red blood cells relative to their size.',
    whyItMatters:
      'Clinicians use MCHC as part of the complete red cell index profile to understand red blood cell appearance.',
    aboveRangeMeaning:
      'Slightly elevated MCHC can reflect specific red cell shapes or occasional laboratory sample interference.',
    belowRangeMeaning:
      'Lower MCHC can appear when red blood cells contain less hemoglobin than usual, often alongside low iron.',
    balancedTakeaway:
      'Small MCHC shifts are commonly interpreted only in light of hemoglobin, MCV, and blood smear findings.',
    doctorQuestions: [
      'Is my MCHC clinically meaningful alongside the rest of my Complete Blood Count?',
    ],
    rangeVariationNote:
      'Intervals depend on the specific analyzer calibration at the testing laboratory.',
    urgentGuidanceNote:
      'Share complete CBC results with your provider for personalized interpretation.',
  },
  {
    id: 'rdw',
    canonicalName: 'Red Cell Distribution Width',
    abbreviation: 'RDW',
    panel: 'Complete Blood Count (CBC)',
    aliases: ['rdw', 'rdw-cv', 'red cell distribution width'],
    expectedUnits: ['%'],
    whatItMeasures:
      'Red Cell Distribution Width reflects how uniform or varied your red blood cells are in size.',
    whyItMatters:
      'Greater variation in cell size can be an early clue to shifting iron or vitamin levels before hemoglobin itself drops.',
    aboveRangeMeaning:
      'A higher RDW means your red blood cells vary more in size than usual, which can happen during nutritional shifts or mixed anemia patterns.',
    belowRangeMeaning:
      'A lower RDW simply means your red blood cells are very uniform in size and is rarely a cause for concern.',
    balancedTakeaway:
      'RDW is always evaluated together with MCV and hemoglobin rather than on its own.',
    doctorQuestions: [
      'Does my RDW suggest checking iron, vitamin B12, or folate stores?',
    ],
    rangeVariationNote:
      'Different laboratories report either RDW-CV (%) or RDW-SD (fL) with distinct reference intervals.',
    urgentGuidanceNote:
      'Discuss abnormal RDW values with a clinician in context with your full blood count.',
  },
  {
    id: 'fasting_glucose',
    canonicalName: 'Fasting Blood Glucose',
    abbreviation: 'FBS / Fasting Glucose',
    panel: 'Metabolic Panel (BMP / CMP)',
    aliases: ['fbs', 'fasting glucose', 'fasting blood glucose', 'fasting blood sugar', 'glucose fasting', 'fbg'],
    expectedUnits: ['mg/dL', 'mmol/L'],
    criticalThresholds: {
      'mg/dl': { low: 45, high: 450 },
      'mmol/l': { low: 2.5, high: 25.0 },
    },
    whatItMeasures:
      'Fasting Blood Glucose measures the concentration of sugar circulating in your bloodstream after a period without food or caloric drinks (usually 8 to 12 hours).',
    whyItMatters:
      'Clinicians measure fasting glucose to evaluate baseline blood sugar regulation and screen for impaired fasting glucose or diabetes.',
    aboveRangeMeaning:
      'Elevated fasting glucose can reflect insulin resistance, incomplete fasting before the blood draw, acute stress or illness, or medications such as steroids.',
    belowRangeMeaning:
      'Lower fasting glucose can happen with prolonged fasting, intense recent physical activity, alcohol use, or glucose-lowering medications.',
    balancedTakeaway:
      'A single elevated fasting glucose reading does not confirm diabetes on its own. Clinicians often confirm with a repeat fasting test or Hemoglobin A1c.',
    doctorQuestions: [
      'Would checking Hemoglobin A1c (HbA1c) help confirm my average blood sugar trend?',
      'How many hours of fasting did this reference range assume?',
      'What nutrition or activity steps can support healthy fasting glucose levels?',
    ],
    rangeVariationNote:
      'Reference intervals differ depending on whether the sample was drawn fasting or non-fasting.',
    urgentGuidanceNote:
      'Severely low or very high glucose readings—especially with confusion, shakiness, excessive thirst, nausea, or sweating—require immediate medical attention.',
  },
  {
    id: 'glucose',
    canonicalName: 'Blood Glucose',
    abbreviation: 'Glucose',
    panel: 'Metabolic Panel (BMP / CMP)',
    aliases: ['glucose', 'blood glucose', 'serum glucose', 'random glucose', 'plasma glucose'],
    expectedUnits: ['mg/dL', 'mmol/L'],
    criticalThresholds: {
      'mg/dl': { low: 45, high: 450 },
      'mmol/l': { low: 2.5, high: 25.0 },
    },
    whatItMeasures:
      'Blood Glucose measures the amount of sugar currently circulating in your bloodstream, which serves as your body’s primary fuel source.',
    whyItMatters:
      'Clinicians check blood glucose to evaluate how effectively your body regulates blood sugar through diet, insulin signaling, and energy metabolism.',
    aboveRangeMeaning:
      'Higher glucose readings can occur if the sample was drawn shortly after eating or drinking, during acute stress or illness, from certain medications, or when insulin regulation is impaired.',
    belowRangeMeaning:
      'Lower glucose readings can happen after prolonged fasting, intense exercise, alcohol intake, or certain blood-sugar-lowering medications.',
    balancedTakeaway:
      'A single blood glucose value depends heavily on whether you fasted before the draw. Clinicians frequently pair it with an HbA1c test to see longer-term blood sugar patterns.',
    doctorQuestions: [
      'Was this reference interval intended for a fasting or non-fasting blood sample?',
      'Would checking Hemoglobin A1c (HbA1c) help clarify my average blood sugar over time?',
      'What practical nutrition or activity habits best support healthy glucose levels for me?',
    ],
    rangeVariationNote:
      'Reference intervals depend heavily on whether the sample was collected after fasting (typically 8–12 hours) or after eating.',
    urgentGuidanceNote:
      'Severely low or very high glucose readings—especially with confusion, shakiness, excessive thirst, nausea, or sweating—require immediate medical attention.',
  },
  {
    id: 'hba1c',
    canonicalName: 'Glycated Hemoglobin A1c',
    abbreviation: 'HbA1c',
    panel: 'Diabetes & Glycemic Control',
    aliases: ['hba1c', 'hemoglobin a1c', 'a1c', 'glycated hemoglobin', 'glycosylated hemoglobin'],
    expectedUnits: ['%', 'mmol/mol'],
    whatItMeasures:
      'Glycated Hemoglobin A1c measures the percentage of hemoglobin proteins in your red blood cells that have glucose attached, reflecting your average blood sugar over roughly the past 2 to 3 months.',
    whyItMatters:
      'Unlike a single fasting or random glucose test that fluctuates hour by hour, HbA1c provides a steady longer-term view of blood sugar regulation.',
    aboveRangeMeaning:
      'An elevated HbA1c indicates that average blood sugar levels over recent months have been higher than the printed reference range, which clinicians evaluate for prediabetes or diabetes patterns.',
    belowRangeMeaning:
      'Lower HbA1c values typically reflect consistently low-to-normal average glucose, though unusually low results can occasionally be influenced by rapid red blood cell turnover or anemia.',
    balancedTakeaway:
      'Because HbA1c relies on red blood cells, conditions affecting hemoglobin or red cell lifespan can alter readings. Your clinician interprets HbA1c alongside fasting glucose and medical history.',
    doctorQuestions: [
      'What HbA1c target range is most appropriate for my age and health profile?',
      'How does my HbA1c compare with my fasting glucose measurement?',
      'How often should I recheck HbA1c to monitor changes over time?',
    ],
    rangeVariationNote:
      'Laboratories may report HbA1c as a percentage (%) or in IFCC units (mmol/mol), and target ranges vary by individual health context.',
    urgentGuidanceNote:
      'Review elevated HbA1c results with your physician so they can interpret them alongside fasting glucose and medical history.',
  },
  {
    id: 'sodium',
    canonicalName: 'Serum Sodium',
    abbreviation: 'Na',
    panel: 'Metabolic Panel (BMP / CMP)',
    aliases: ['sodium', 'na', 'serum sodium', 'na+'],
    expectedUnits: ['mmol/L', 'mEq/L'],
    criticalThresholds: {
      'mmol/l': { low: 120, high: 160 },
    },
    whatItMeasures:
      'Serum Sodium is an essential electrolyte in your blood that regulates fluid balance, blood pressure, and electrical signaling in nerves and muscles.',
    whyItMatters:
      'Clinicians measure sodium to assess hydration status, kidney water handling, and potential effects of blood pressure or diuretic medications.',
    aboveRangeMeaning:
      'Higher sodium levels most commonly occur when the body loses more water than sodium, such as during dehydration, fever, or inadequate fluid intake.',
    belowRangeMeaning:
      'Lower sodium levels can result from excess water retention, certain medications (like diuretics), gastrointestinal fluid losses, or hormonal and kidney shifts.',
    balancedTakeaway:
      'Mildly borderline sodium values often reflect recent hydration balance. Your clinician evaluates sodium alongside other electrolytes and medication use.',
    doctorQuestions: [
      'Could any of my current medications or recent fluid intake affect my sodium level?',
      'Is my sodium change mild enough to check simply with hydration and follow-up?',
    ],
    rangeVariationNote:
      'Adult intervals are fairly consistent across labs, though mild shifts can reflect recent fluid intake or lab equipment calibration.',
    urgentGuidanceNote:
      'Markedly high or low sodium levels—particularly with confusion, severe weakness, headache, or seizures—need urgent clinical evaluation.',
  },
  {
    id: 'potassium',
    canonicalName: 'Serum Potassium',
    abbreviation: 'K',
    panel: 'Metabolic Panel (BMP / CMP)',
    aliases: ['potassium', 'k', 'serum potassium', 'k+'],
    expectedUnits: ['mmol/L', 'mEq/L'],
    criticalThresholds: {
      'mmol/l': { low: 2.5, high: 6.5 },
    },
    whatItMeasures:
      'Serum Potassium is a vital electrolyte that helps regulate heart rhythm, muscle contraction, and nerve signal transmission.',
    whyItMatters:
      'Because the heart and muscles rely on tightly balanced potassium, clinicians routinely monitor it during metabolic checkups and medication reviews.',
    aboveRangeMeaning:
      'Higher potassium can relate to kidney clearance changes, certain blood pressure medications, supplements, or occasionally sample hemolysis (red cell breakage during the blood draw).',
    belowRangeMeaning:
      'Lower potassium can happen with fluid losses from vomiting or diarrhea, diuretic medications, heavy sweating, or hormonal shifts.',
    balancedTakeaway:
      'Falsely elevated potassium from blood draw technique (hemolysis) is common—labs often note this or clinicians confirm unexpected highs with a repeat draw.',
    doctorQuestions: [
      'Was there any sample hemolysis noted on my lab report?',
      'Do any of my medications or supplements influence potassium levels?',
      'Should this reading be rechecked to confirm it is accurate?',
    ],
    rangeVariationNote:
      'Sometimes sample collection factors (like red cell breakdown during the draw) can cause falsely elevated potassium; labs often flag this.',
    urgentGuidanceNote:
      'Substantially high or low potassium readings—especially with palpitations, chest pain, or severe muscle weakness—warrant prompt medical evaluation.',
  },
  {
    id: 'chloride',
    canonicalName: 'Serum Chloride',
    abbreviation: 'Cl',
    panel: 'Metabolic Panel (BMP / CMP)',
    aliases: ['chloride', 'cl', 'serum chloride', 'cl-'],
    expectedUnits: ['mmol/L', 'mEq/L'],
    whatItMeasures:
      'Serum Chloride is a negatively charged electrolyte that works alongside sodium and bicarbonate to keep body fluids and acid-base balance steady.',
    whyItMatters:
      'Clinicians review chloride as part of the full electrolyte panel to evaluate hydration and acid-base balance.',
    aboveRangeMeaning:
      'Elevated chloride often moves alongside elevated sodium during dehydration or certain acid-base shifts.',
    belowRangeMeaning:
      'Lower chloride can occur with prolonged vomiting, diuretic use, or low sodium levels.',
    balancedTakeaway:
      'Isolated small shifts in chloride are rarely concerning without changes in sodium, bicarbonate (CO2), or kidney markers.',
    doctorQuestions: [
      'How do my chloride, sodium, and CO2 (bicarbonate) levels look together?',
    ],
    rangeVariationNote:
      'Reference intervals vary slightly by laboratory analyzer.',
    urgentGuidanceNote:
      'Discuss electrolyte imbalances with your healthcare provider.',
  },
  {
    id: 'co2',
    canonicalName: 'Carbon Dioxide / Bicarbonate',
    abbreviation: 'CO2 / HCO3',
    panel: 'Metabolic Panel (BMP / CMP)',
    aliases: ['co2', 'carbon dioxide', 'bicarbonate', 'hco3', 'total co2'],
    expectedUnits: ['mmol/L', 'mEq/L'],
    whatItMeasures:
      'Total Carbon Dioxide in a blood chemistry panel primarily measures bicarbonate, a natural buffer that keeps your blood from becoming too acidic or too alkaline.',
    whyItMatters:
      'It helps clinicians evaluate how well your lungs and kidneys are maintaining your body’s acid-base balance.',
    aboveRangeMeaning:
      'Higher bicarbonate can occur with acid loss from the stomach (such as vomiting), certain diuretics, or chronic breathing conditions.',
    belowRangeMeaning:
      'Lower bicarbonate can happen with metabolic acid shifts, diarrhea, kidney changes, or rapid breathing.',
    balancedTakeaway:
      'Bicarbonate is always interpreted alongside sodium, chloride, potassium, and kidney function tests.',
    doctorQuestions: [
      'Is my bicarbonate value mild and related to temporary hydration or breathing factors?',
    ],
    rangeVariationNote:
      'Reference intervals may vary modestly depending on venous vs. arterial sampling and lab methods.',
    urgentGuidanceNote:
      'Significantly abnormal bicarbonate alongside rapid breathing, severe vomiting, or confusion warrants prompt medical care.',
  },
  {
    id: 'bun',
    canonicalName: 'Blood Urea Nitrogen',
    abbreviation: 'BUN',
    panel: 'Metabolic Panel (BMP / CMP)',
    aliases: ['bun', 'blood urea nitrogen', 'urea nitrogen', 'urea'],
    expectedUnits: ['mg/dL', 'mmol/L'],
    whatItMeasures:
      'Blood Urea Nitrogen measures the nitrogen component of urea, a normal waste product created when your liver breaks down protein and filtered out by your kidneys.',
    whyItMatters:
      'Clinicians review BUN together with creatinine to evaluate kidney waste clearance and hydration status.',
    aboveRangeMeaning:
      'Higher BUN can occur with dehydration, a high-protein diet, recent intense exercise, certain medications, or reduced kidney filtration.',
    belowRangeMeaning:
      'Lower BUN is usually harmless and can be seen with low protein intake, overhydration, pregnancy, or reduced liver urea synthesis.',
    balancedTakeaway:
      'Because diet and hydration easily affect BUN, clinicians always compare it against creatinine and eGFR before drawing conclusions about kidney health.',
    doctorQuestions: [
      'How does my BUN compare with my creatinine and eGFR?',
      'Could hydration or protein intake before the test have raised or lowered my BUN?',
    ],
    rangeVariationNote:
      'Reference ranges can vary with age, dietary protein intake, hydration, and pregnancy.',
    urgentGuidanceNote:
      'Discuss elevated BUN results with your healthcare professional, especially if paired with elevated creatinine or reduced urination.',
  },
  {
    id: 'creatinine',
    canonicalName: 'Serum Creatinine',
    abbreviation: 'Creatinine',
    panel: 'Metabolic Panel (BMP / CMP)',
    aliases: ['creatinine', 'serum creatinine', 'creat'],
    expectedUnits: ['mg/dL', 'umol/L'],
    criticalThresholds: {
      'mg/dl': { high: 5.0 },
    },
    whatItMeasures:
      'Serum Creatinine is a natural breakdown product from everyday muscle activity that healthy kidneys filter steadily out of the bloodstream into urine.',
    whyItMatters:
      'Creatinine is one of the primary markers clinicians use to estimate kidney filtration rate (eGFR) and monitor hydration or medication safety.',
    aboveRangeMeaning:
      'Higher creatinine can reflect reduced kidney filtration, dehydration, heavy muscle mass, creatine supplements, or intense recent workouts.',
    belowRangeMeaning:
      'Lower creatinine is typically seen in individuals with smaller muscle mass or during pregnancy, and is rarely a medical problem on its own.',
    balancedTakeaway:
      'A single creatinine number depends heavily on muscle mass and hydration. Clinicians look at your baseline trend over time and calculated eGFR.',
    doctorQuestions: [
      'How does this creatinine compare to my previous measurements?',
      'What is my corresponding eGFR, and should I adjust hydration or supplements before retesting?',
    ],
    rangeVariationNote:
      'Expected creatinine levels differ by biological sex, age, muscle mass, and hydration status.',
    urgentGuidanceNote:
      'Sudden or marked increases in creatinine should be reviewed promptly with your physician.',
  },
  {
    id: 'egfr',
    canonicalName: 'Estimated Glomerular Filtration Rate',
    abbreviation: 'eGFR',
    panel: 'Kidney Function',
    aliases: ['egfr', 'gfr', 'estimated gfr', 'egfr non-afr. american', 'egfr cr'],
    expectedUnits: ['mL/min/1.73m2', 'mL/min/1.73 m2', 'mL/min'],
    whatItMeasures:
      'Estimated Glomerular Filtration Rate is a mathematical estimate of how many milliliters of blood your kidneys filter per minute, calculated from serum creatinine and age.',
    whyItMatters:
      'It gives clinicians a standardized way to track overall kidney filtering capacity over time.',
    aboveRangeMeaning:
      'Higher eGFR values (often reported simply as >60 or >90) generally indicate normal or robust kidney filtration.',
    belowRangeMeaning:
      'Lower eGFR values can indicate reduced kidney filtration, temporary dehydration, medication effects, or age-related kidney changes.',
    balancedTakeaway:
      'Because eGFR is estimated from creatinine, anything that temporarily raises creatinine (like dehydration or creatine use) can lower eGFR. Trends over multiple tests matter most.',
    doctorQuestions: [
      'Is my eGFR stable compared with prior lab tests?',
      'Would a urine albumin check give helpful additional context about kidney health?',
    ],
    rangeVariationNote:
      'Labs use standardized equations (such as CKD-EPI) and may display >60 or >90 thresholds depending on reporting policy.',
    urgentGuidanceNote:
      'Discuss reduced or changing eGFR trends with a qualified clinician for accurate context.',
  },
  {
    id: 'calcium',
    canonicalName: 'Serum Calcium',
    abbreviation: 'Ca',
    panel: 'Metabolic Panel (BMP / CMP)',
    aliases: ['calcium', 'ca', 'serum calcium', 'total calcium'],
    expectedUnits: ['mg/dL', 'mmol/L'],
    criticalThresholds: {
      'mg/dl': { low: 6.5, high: 13.0 },
    },
    whatItMeasures:
      'Serum Calcium measures the calcium circulating in your bloodstream, which supports nerve signaling, muscle contraction, heart rhythm, and bone mineral balance.',
    whyItMatters:
      'Clinicians monitor calcium to evaluate bone metabolism, parathyroid gland signaling, vitamin D status, and kidney handling of minerals.',
    aboveRangeMeaning:
      'Elevated calcium can be associated with overactive parathyroid signaling, dehydration, high vitamin D or calcium supplement intake, or other metabolic factors.',
    belowRangeMeaning:
      'Lower total calcium can reflect low vitamin D, low blood albumin levels (since albumin carries calcium), magnesium imbalance, or parathyroid changes.',
    balancedTakeaway:
      'Total blood calcium does not directly measure how much calcium is in your bones, and it shifts if blood albumin is low. Clinicians sometimes check ionized calcium or parathyroid hormone.',
    doctorQuestions: [
      'Does my albumin level affect how my total calcium should be interpreted?',
      'Should my vitamin D or parathyroid hormone (PTH) levels be checked alongside calcium?',
    ],
    rangeVariationNote:
      'Total calcium can be influenced by blood albumin levels and age.',
    urgentGuidanceNote:
      'Very high or very low calcium—especially with muscle spasms, numbness, or confusion—requires timely medical evaluation.',
  },
  {
    id: 'total_protein',
    canonicalName: 'Total Serum Protein',
    abbreviation: 'Total Protein',
    panel: 'Comprehensive Metabolic Panel (CMP)',
    aliases: ['total protein', 'protein, total', 'serum protein'],
    expectedUnits: ['g/dL', 'g/L'],
    whatItMeasures:
      'Total Serum Protein measures the combined concentration of albumin and globulin proteins circulating in your blood plasma.',
    whyItMatters:
      'Blood proteins maintain fluid pressure inside vessels, transport hormones and nutrients, and include antibodies for immune defense.',
    aboveRangeMeaning:
      'Higher total protein can occur with dehydration or increased immune globulin proteins during chronic inflammation or infection.',
    belowRangeMeaning:
      'Lower total protein can reflect lower albumin production, reduced protein nutrition, or protein loss through the kidneys or digestive tract.',
    balancedTakeaway:
      'Clinicians review total protein alongside albumin and calculated globulin to understand which protein group shifted.',
    doctorQuestions: [
      'Are both my albumin and globulin fractions balanced within my total protein?',
    ],
    rangeVariationNote:
      'Intervals vary slightly across testing laboratories.',
    urgentGuidanceNote:
      'Clinicians interpret total protein together with albumin and liver or kidney markers.',
  },
  {
    id: 'albumin',
    canonicalName: 'Serum Albumin',
    abbreviation: 'Albumin',
    panel: 'Comprehensive Metabolic Panel (CMP)',
    aliases: ['albumin', 'serum albumin', 'alb'],
    expectedUnits: ['g/dL', 'g/L'],
    whatItMeasures:
      'Serum Albumin is the most abundant protein made by your liver; it keeps fluid inside blood vessels and carries hormones, vitamins, and medications.',
    whyItMatters:
      'Albumin provides insight into liver protein synthesis, nutritional balance, and whether the kidneys are retaining proteins properly.',
    aboveRangeMeaning:
      'Slightly elevated albumin almost always reflects temporary dehydration (less water in the blood concentrates the protein).',
    belowRangeMeaning:
      'Lower albumin can relate to inflammation, reduced liver production, lower nutritional protein intake, pregnancy, or protein loss in urine.',
    balancedTakeaway:
      'Albumin is evaluated together with liver enzymes, total protein, and kidney markers.',
    doctorQuestions: [
      'Could a mild change in albumin simply reflect hydration status?',
      'How do my albumin and liver enzyme results look together?',
    ],
    rangeVariationNote:
      'Reference intervals differ slightly by lab method and pregnancy status.',
    urgentGuidanceNote:
      'Significantly low albumin with swelling in the legs or abdomen should be reviewed with a doctor.',
  },
  {
    id: 'total_bilirubin',
    canonicalName: 'Total Bilirubin',
    abbreviation: 'T. Bilirubin',
    panel: 'Liver Function / CMP',
    aliases: ['total bilirubin', 'bilirubin, total', 'bilirubin total', 't. bilirubin', 'tbil'],
    expectedUnits: ['mg/dL', 'umol/L'],
    whatItMeasures:
      'Total Bilirubin measures a natural yellow pigment created when older red blood cells are recycled; your liver processes and clears it into bile.',
    whyItMatters:
      'Measuring bilirubin helps clinicians evaluate liver processing, bile duct flow, and red blood cell turnover.',
    aboveRangeMeaning:
      'Elevated bilirubin can occur from benign inherited processing traits (such as Gilbert’s syndrome, especially during fasting or stress), liver cell irritation, bile duct slowing, or faster red blood cell breakdown.',
    belowRangeMeaning:
      'Lower bilirubin levels are generally not considered clinically concerning.',
    balancedTakeaway:
      'If bilirubin is mildly elevated while AST, ALT, and ALP are completely normal, clinicians often consider benign factors like fasting or Gilbert’s trait.',
    doctorQuestions: [
      'Are my other liver enzymes (AST, ALT, ALP) within range alongside bilirubin?',
      'Would separating direct and indirect bilirubin help clarify this result?',
    ],
    rangeVariationNote:
      'Reference ranges differ substantially for newborns compared with older children and adults.',
    urgentGuidanceNote:
      'Markedly elevated bilirubin accompanied by yellowing of the skin or eyes, dark urine, or severe abdominal pain needs prompt medical attention.',
  },
  {
    id: 'ast',
    canonicalName: 'Aspartate Aminotransferase',
    abbreviation: 'AST (SGOT)',
    panel: 'Liver Function / CMP',
    aliases: ['ast', 'sgot', 'ast (sgot)', 'aspartate aminotransferase'],
    expectedUnits: ['U/L', 'IU/L'],
    whatItMeasures:
      'Aspartate Aminotransferase is an enzyme found primarily inside liver cells, heart muscle, and skeletal muscles.',
    whyItMatters:
      'Clinicians measure AST alongside ALT to check for liver cell irritation or muscle tissue stress.',
    aboveRangeMeaning:
      'Elevated AST can occur with liver irritation (from fatty liver, medications, supplements, or alcohol), as well as after strenuous weightlifting or muscle injury.',
    belowRangeMeaning:
      'Low AST values are generally considered normal and rarely cause clinical concern.',
    balancedTakeaway:
      'Because AST is present in muscles as well as the liver, heavy exercise in the days before a blood test can temporarily raise it. Clinicians compare AST with ALT for clarity.',
    doctorQuestions: [
      'Could recent vigorous exercise, medications, or supplements have raised my AST?',
      'How do my AST and ALT values compare with each other?',
    ],
    rangeVariationNote:
      'Reference intervals vary by laboratory, biological sex, and recent strenuous exercise.',
    urgentGuidanceNote:
      'Substantially elevated liver enzymes or symptoms such as severe abdominal pain or jaundice warrant prompt clinician review.',
  },
  {
    id: 'alt',
    canonicalName: 'Alanine Aminotransferase',
    abbreviation: 'ALT (SGPT)',
    panel: 'Liver Function / CMP',
    aliases: ['alt', 'sgpt', 'alt (sgpt)', 'alanine aminotransferase'],
    expectedUnits: ['U/L', 'IU/L'],
    whatItMeasures:
      'Alanine Aminotransferase is an enzyme found predominantly inside liver cells that helps convert proteins into energy.',
    whyItMatters:
      'Because ALT is much more concentrated in the liver than in other tissues, it is one of the most informative routine markers of liver cell health.',
    aboveRangeMeaning:
      'Elevated ALT indicates liver cell irritation or stress, which can stem from metabolic factors (such as hepatic fat buildup), prescription or over-the-counter medications, herbal supplements, alcohol, or viral infections.',
    belowRangeMeaning:
      'Low ALT levels are typically normal and not a source of concern.',
    balancedTakeaway:
      'Mildly elevated ALT is common and often reversible depending on the cause. A clinician reviews medications, supplements, alcohol intake, and metabolic markers before deciding on follow-up.',
    doctorQuestions: [
      'Could any prescription drugs, pain relievers, or herbal supplements be affecting my ALT?',
      'Should we repeat this liver panel after making lifestyle or medication adjustments?',
    ],
    rangeVariationNote:
      'Upper limits of normal vary by laboratory and biological sex.',
    urgentGuidanceNote:
      'Significantly elevated ALT, particularly with nausea, dark urine, or yellowing skin, should be evaluated promptly by a clinician.',
  },
  {
    id: 'alp',
    canonicalName: 'Alkaline Phosphatase',
    abbreviation: 'ALP',
    panel: 'Liver Function / CMP',
    aliases: ['alkaline phosphatase', 'alp', 'alk phos'],
    expectedUnits: ['U/L', 'IU/L'],
    whatItMeasures:
      'Alkaline Phosphatase is an enzyme concentrated mainly in the liver’s bile ducts and in actively growing or remodeling bone tissue.',
    whyItMatters:
      'Clinicians monitor ALP to evaluate bile duct flow and bone turnover alongside liver and calcium tests.',
    aboveRangeMeaning:
      'Higher ALP can come from bile duct slowing, liver changes, normal bone growth in youth, healing fractures, vitamin D deficiency, or pregnancy.',
    belowRangeMeaning:
      'Lower ALP is uncommon and can occasionally relate to nutritional shortfalls such as low zinc or magnesium.',
    balancedTakeaway:
      'Because ALP comes from both liver and bone, clinicians may check GGT or liver markers to identify which tissue contributed to an elevation.',
    doctorQuestions: [
      'Is this ALP elevation likely related to liver/bile flow or bone turnover?',
      'Do my other liver tests and vitamin D levels look balanced?',
    ],
    rangeVariationNote:
      'ALP ranges are naturally higher in growing children, adolescents, and during pregnancy.',
    urgentGuidanceNote:
      'Discuss abnormal ALP results with your healthcare provider for appropriate context.',
  },
  {
    id: 'total_cholesterol',
    canonicalName: 'Total Cholesterol',
    abbreviation: 'Cholesterol',
    panel: 'Lipid Panel',
    aliases: ['total cholesterol', 'cholesterol, total', 'cholesterol total', 'cholesterol'],
    expectedUnits: ['mg/dL', 'mmol/L'],
    whatItMeasures:
      'Total Cholesterol sums all cholesterol carried in your bloodstream across LDL, HDL, and remnant lipid particles.',
    whyItMatters:
      'It gives a high-level screening snapshot of blood lipids, though clinicians focus more closely on LDL, HDL, and triglycerides to assess heart health.',
    aboveRangeMeaning:
      'A higher total cholesterol can occur due to elevated LDL cholesterol, elevated triglycerides, or sometimes high protective HDL cholesterol—which is why looking at the individual sub-fractions matters.',
    belowRangeMeaning:
      'Lower total cholesterol generally aligns with lower cardiovascular risk, though very low readings can sometimes reflect nutrition, thyroid activity, or cholesterol-lowering therapy.',
    balancedTakeaway:
      'Total cholesterol alone cannot tell whether an elevation comes from LDL ("less favorable") or HDL ("protective") cholesterol. Always review the full lipid breakdown.',
    doctorQuestions: [
      'Is my total cholesterol driven mostly by LDL or by a high HDL?',
      'Given my overall health profile, what lipid goals make sense for me?',
    ],
    rangeVariationNote:
      'Many labs list clinical target thresholds (e.g., < 200 mg/dL) rather than strict physiological boundaries.',
    urgentGuidanceNote:
      'Discuss lipid panel targets with your provider, as ideal ranges depend on your overall cardiovascular profile.',
  },
  {
    id: 'ldl',
    canonicalName: 'Low-Density Lipoprotein Cholesterol',
    abbreviation: 'LDL Cholesterol',
    panel: 'Lipid Panel',
    aliases: ['ldl', 'ldl cholesterol', 'ldl-c', 'ldl chol calc', 'ldl cholesterol calculated', 'low-density lipoprotein cholesterol'],
    expectedUnits: ['mg/dL', 'mmol/L'],
    whatItMeasures:
      'Low-Density Lipoprotein (LDL) carries cholesterol through the bloodstream to body tissues; excess LDL particles can gradually deposit along artery walls.',
    whyItMatters:
      'LDL cholesterol is one of the primary markers clinicians track when evaluating long-term cardiovascular and blood vessel health.',
    aboveRangeMeaning:
      'Higher LDL levels can reflect genetics, dietary saturated or trans fats, sedentary habits, thyroid underactivity, or other metabolic factors.',
    belowRangeMeaning:
      'Lower LDL cholesterol is generally favorable for artery health and commonly results from nutrition, genetics, or cholesterol-lowering medications.',
    balancedTakeaway:
      'An ideal LDL target is personalized—what is acceptable for one person may differ for someone with diabetes, high blood pressure, or family heart history.',
    doctorQuestions: [
      'What LDL target is recommended based on my personal cardiovascular risk?',
      'Which dietary or exercise changes have the biggest impact on LDL?',
      'Should we recheck my lipid panel after lifestyle adjustments?',
    ],
    rangeVariationNote:
      'Optimal thresholds vary depending on age, family history, and personal cardiovascular risk factors.',
    urgentGuidanceNote:
      'Review elevated LDL results with your clinician to discuss individualized nutrition, lifestyle, or monitoring plans.',
  },
  {
    id: 'hdl',
    canonicalName: 'High-Density Lipoprotein Cholesterol',
    abbreviation: 'HDL Cholesterol',
    panel: 'Lipid Panel',
    aliases: ['hdl', 'hdl cholesterol', 'hdl-c', 'high-density lipoprotein cholesterol'],
    expectedUnits: ['mg/dL', 'mmol/L'],
    whatItMeasures:
      'High-Density Lipoprotein (HDL) helps collect excess cholesterol from blood vessels and carry it back to the liver for recycling or removal.',
    whyItMatters:
      'Higher HDL levels are generally associated with efficient cholesterol clearance, evaluated together with LDL and triglycerides.',
    aboveRangeMeaning:
      'Higher HDL is typically considered supportive, often seen with regular aerobic exercise and genetics.',
    belowRangeMeaning:
      'Lower HDL can occur with smoking, low physical activity, insulin resistance, or elevated triglycerides.',
    balancedTakeaway:
      'HDL is only one piece of the lipid puzzle; clinicians look at your total-to-HDL ratio, LDL, and triglycerides together.',
    doctorQuestions: [
      'How can I support healthy HDL alongside lowering or maintaining LDL?',
    ],
    rangeVariationNote:
      'Reference thresholds frequently differ for men and women.',
    urgentGuidanceNote:
      'Share your complete lipid panel with your doctor rather than interpreting HDL in isolation.',
  },
  {
    id: 'triglycerides',
    canonicalName: 'Triglycerides',
    abbreviation: 'TG',
    panel: 'Lipid Panel',
    aliases: ['triglycerides', 'triglyceride', 'tg', 'trigs'],
    expectedUnits: ['mg/dL', 'mmol/L'],
    whatItMeasures:
      'Triglycerides are a type of blood fat used to store and transport extra energy from food, especially carbohydrates and fats.',
    whyItMatters:
      'Elevated triglycerides can contribute to cardiovascular risk and reflect how your body processes sugars, fats, and alcohol.',
    aboveRangeMeaning:
      'Higher triglycerides commonly occur if the blood sample was taken after eating (non-fasting), or with diets high in refined sugars, alcohol intake, weight changes, or insulin resistance.',
    belowRangeMeaning:
      'Lower triglycerides are generally favorable unless accompanied by signs of malnutrition or overactive thyroid.',
    balancedTakeaway:
      'Triglycerides fluctuate noticeably after meals. If you had eaten before your blood draw, ask your clinician whether a fasting recheck is helpful.',
    doctorQuestions: [
      'Was this test drawn while fasting, and could a recent meal explain an elevation?',
      'What nutrition adjustments help lower triglycerides effectively?',
    ],
    rangeVariationNote:
      'Triglyceride measurements can rise noticeably if a blood sample was drawn without fasting.',
    urgentGuidanceNote:
      'Very high triglyceride readings should be reviewed promptly with a healthcare professional.',
  },
  {
    id: 'tsh',
    canonicalName: 'Thyroid-Stimulating Hormone',
    abbreviation: 'TSH',
    panel: 'Thyroid Panel',
    aliases: ['tsh', 'thyroid stimulating hormone', 'thyroid-stimulating hormone', 'thyrotropin'],
    expectedUnits: ['mIU/L', 'uIU/mL', 'mU/L'],
    whatItMeasures:
      'Thyroid-Stimulating Hormone is a messenger hormone released by the pituitary gland in your brain that tells your thyroid gland how much thyroid hormone to produce.',
    whyItMatters:
      'Thyroid hormones control energy, metabolism, heart rate, and temperature regulation, making TSH the primary screening check for thyroid balance.',
    aboveRangeMeaning:
      'A higher TSH typically signals that the pituitary is asking the thyroid to work harder—often seen when thyroid hormone production is slowing down (hypothyroidism) or during recovery from illness.',
    belowRangeMeaning:
      'A lower TSH typically indicates that the pituitary is easing off because circulating thyroid hormone levels are already high (hyperthyroidism) or thyroid medication dosing is too high.',
    balancedTakeaway:
      'TSH moves in the opposite direction of thyroid hormone output (higher TSH often goes with lower thyroid hormone, and vice versa). Clinicians frequently check Free T4 alongside TSH before drawing conclusions.',
    doctorQuestions: [
      'Would measuring Free T4 or thyroid antibodies clarify this TSH value?',
      'Could biotin supplements, time of day, or recent illness have influenced my TSH?',
      'If I take thyroid medication, does my dosage need review?',
    ],
    rangeVariationNote:
      'TSH ranges vary by laboratory assay, time of day, age, and trimester during pregnancy.',
    urgentGuidanceNote:
      'Markedly abnormal TSH alongside severe palpitations, unexplained weight shifts, or extreme fatigue should be discussed with your physician.',
  },
  {
    id: 'free_t4',
    canonicalName: 'Free Thyroxine',
    abbreviation: 'Free T4',
    panel: 'Thyroid Panel',
    aliases: ['free t4', 'ft4', 'thyroxine, free', 't4 free', 'free thyroxine'],
    expectedUnits: ['ng/dL', 'pmol/L'],
    whatItMeasures:
      'Free Thyroxine measures the unbound, active form of thyroxine hormone circulating in your bloodstream and available to body cells.',
    whyItMatters:
      'Clinicians pair Free T4 with TSH to confirm whether overall thyroid hormone availability is balanced, low, or elevated.',
    aboveRangeMeaning:
      'Elevated Free T4 suggests excess circulating thyroid hormone, from thyroid overactivity or thyroid hormone medication.',
    belowRangeMeaning:
      'Lower Free T4 suggests reduced thyroid hormone output, commonly evaluated alongside an elevated TSH.',
    balancedTakeaway:
      'Free T4 is always interpreted together with TSH and your symptom history.',
    doctorQuestions: [
      'How do my Free T4 and TSH results align with each other?',
    ],
    rangeVariationNote:
      'Reference intervals depend strongly on the laboratory immunoassay and pregnancy status.',
    urgentGuidanceNote:
      'Review thyroid hormone panels with your clinician for proper context.',
  },
  {
    id: 'vitamin_d',
    canonicalName: '25-Hydroxy Vitamin D',
    abbreviation: 'Vitamin D',
    panel: 'Vitamins & Nutrition',
    aliases: ['vitamin d', '25-hydroxy vitamin d', '25-oh vitamin d', 'vit d', '25(oh)d', 'vitamin d, 25-hydroxy'],
    expectedUnits: ['ng/mL', 'nmol/L'],
    whatItMeasures:
      '25-Hydroxy Vitamin D is the main storage form of vitamin D circulating in the blood, reflecting supply from sunlight, food, and supplements.',
    whyItMatters:
      'Vitamin D helps your body absorb calcium, maintain strong bones, and support normal muscle and immune function.',
    aboveRangeMeaning:
      'High vitamin D almost always comes from taking high-dose vitamin D supplements rather than sunlight or diet.',
    belowRangeMeaning:
      'Lower vitamin D is very common, especially with limited sun exposure, winter months, darker skin pigmentation, or reduced dietary/supplement intake.',
    balancedTakeaway:
      'Laboratories sometimes use different "sufficient" versus "insufficient" cutoffs. Discuss supplement dosing with your clinician rather than guessing high doses on your own.',
    doctorQuestions: [
      'Based on this level, do I need a daily vitamin D supplement and at what dose?',
      'Should we recheck vitamin D in a few months to confirm it reaches a healthy level?',
    ],
    rangeVariationNote:
      'Laboratories may report sufficiency thresholds differently, and seasonal sun exposure affects levels.',
    urgentGuidanceNote:
      'Before starting or changing high-dose vitamin D supplements, consult a healthcare professional.',
  },
  {
    id: 'vitamin_b12',
    canonicalName: 'Vitamin B12 (Cobalamin)',
    abbreviation: 'Vitamin B12',
    panel: 'Vitamins & Nutrition',
    aliases: ['vitamin b12', 'b12', 'cobalamin', 'vit b12'],
    expectedUnits: ['pg/mL', 'pmol/L', 'ng/L'],
    whatItMeasures:
      'Vitamin B12 measures an essential water-soluble vitamin needed for red blood cell creation, DNA synthesis, and nerve insulation.',
    whyItMatters:
      'Clinicians test B12 to investigate fatigue, nerve tingling, memory changes, or larger red blood cells (high MCV).',
    aboveRangeMeaning:
      'Elevated B12 is most commonly caused by B12 supplements or multivitamins, though persistently high levels without supplements warrant a quick chat with your doctor.',
    belowRangeMeaning:
      'Low B12 can result from low intake (such as strict plant-based diets without supplementation) or reduced digestive absorption (for example from stomach acid blockers, metformin, or intrinsic factor changes).',
    balancedTakeaway:
      'Borderline-low B12 values are sometimes explored further with folate or methylmalonic acid (MMA) tests.',
    doctorQuestions: [
      'Could any medications or dietary patterns be lowering my B12 absorption?',
      'Is an oral supplement sufficient, or do I need follow-up testing?',
    ],
    rangeVariationNote:
      'Borderline ranges vary across laboratories and may prompt follow-up testing.',
    urgentGuidanceNote:
      'Discuss low B12 results with a clinician, especially if experiencing numbness, tingling, or memory changes.',
  },
  {
    id: 'ferritin',
    canonicalName: 'Serum Ferritin',
    abbreviation: 'Ferritin',
    panel: 'Iron Studies',
    aliases: ['ferritin', 'serum ferritin'],
    expectedUnits: ['ng/mL', 'ug/L', 'pmol/L'],
    whatItMeasures:
      'Serum Ferritin measures a specialized protein that stores iron inside your cells; blood ferritin levels closely mirror your body’s total iron reserves.',
    whyItMatters:
      'Ferritin is the earliest and most sensitive indicator of shrinking iron stores—often dropping before hemoglobin itself falls.',
    aboveRangeMeaning:
      'Elevated ferritin can occur with iron overload, recent iron supplementation, or temporarily during inflammation, infection, or liver irritation (because ferritin rises as an acute-phase protein).',
    belowRangeMeaning:
      'Low ferritin indicates depleted iron reserves, commonly linked to menstrual blood loss, dietary gaps, increased need during pregnancy, or digestive blood loss.',
    balancedTakeaway:
      'Because inflammation can artificially raise ferritin, clinicians often review ferritin alongside serum iron, transferrin saturation, and CRP.',
    doctorQuestions: [
      'Do my ferritin and hemoglobin together suggest iron deficiency or low iron stores?',
      'If iron supplementation is advised, what dose and duration should I follow?',
    ],
    rangeVariationNote:
      'Reference ranges differ substantially by biological sex, age, and inflammatory state.',
    urgentGuidanceNote:
      'Review markedly low or high ferritin with your provider before taking iron supplements.',
  },
  {
    id: 'crp',
    canonicalName: 'C-Reactive Protein',
    abbreviation: 'CRP',
    panel: 'Inflammatory Markers',
    aliases: ['crp', 'c-reactive protein', 'c reactive protein', 'hs-crp'],
    expectedUnits: ['mg/L', 'mg/dL'],
    whatItMeasures:
      'C-Reactive Protein is a protein produced by the liver whose concentration rises when there is inflammation anywhere in the body.',
    whyItMatters:
      'Clinicians use standard CRP to track acute infections or inflammatory conditions, and high-sensitivity CRP (hs-CRP) when evaluating low-grade vascular inflammation.',
    aboveRangeMeaning:
      'Elevated CRP occurs in response to acute infections, tissue injury, autoimmune inflammation, recent surgery, or chronic metabolic stress.',
    belowRangeMeaning:
      'Low CRP values indicate minimal active systemic inflammation and are generally reassuring.',
    balancedTakeaway:
      'CRP acts like a general alarm bell—it signals that inflammation is present, not where it is located or what caused it.',
    doctorQuestions: [
      'Was this a standard CRP or a high-sensitivity CRP (hs-CRP) assay?',
      'Could a recent minor viral infection or injury explain an elevated CRP?',
    ],
    rangeVariationNote:
      'Standard CRP and high-sensitivity CRP (hs-CRP) use different units and clinical reference thresholds.',
    urgentGuidanceNote:
      'CRP is non-specific and should always be interpreted alongside symptoms and physical examination by a doctor.',
  },
  {
    id: 'uric_acid',
    canonicalName: 'Serum Uric Acid',
    abbreviation: 'Urate / Uric Acid',
    panel: 'Metabolic & Renal Markers',
    aliases: ['uric acid', 'urate', 'serum uric acid'],
    expectedUnits: ['mg/dL', 'umol/L'],
    whatItMeasures:
      'Serum Uric Acid is a normal chemical byproduct formed when your body breaks down purines found in cells and certain foods.',
    whyItMatters:
      'Clinicians check uric acid when evaluating joint pain (such as gout), kidney stone risk, or metabolic patterns.',
    aboveRangeMeaning:
      'Higher uric acid can occur from purine-rich foods, fructose/alcohol intake, reduced kidney clearance, dehydration, or certain diuretic medications.',
    belowRangeMeaning:
      'Lower uric acid is usually benign and rarely requires medical attention.',
    balancedTakeaway:
      'Many people have mildly elevated uric acid without ever developing joint symptoms. Clinicians treat symptoms and overall risk rather than a single lab number alone.',
    doctorQuestions: [
      'Is my uric acid level actionable if I do not have joint pain or kidney stones?',
      'What hydration or dietary habits can help keep uric acid balanced?',
    ],
    rangeVariationNote:
      'Reference intervals differ between men and women and across laboratories.',
    urgentGuidanceNote:
      'Discuss elevated uric acid with your clinician, especially if you experience sudden joint swelling or severe pain.',
  },
  {
    id: 'spo2',
    canonicalName: 'Peripheral Oxygen Saturation',
    abbreviation: 'SpO2',
    panel: 'Vital & Respiratory Markers',
    aliases: ['spo2', 'o2 sat', 'oxygen saturation', 'peripheral oxygen saturation', 'pulse oximetry'],
    expectedUnits: ['%'],
    criticalThresholds: {
      '%': { low: 88 },
    },
    whatItMeasures:
      'Peripheral Oxygen Saturation estimates the percentage of hemoglobin in your arterial blood currently carrying oxygen.',
    whyItMatters:
      'Clinicians check SpO2 to evaluate how effectively oxygen is reaching your bloodstream from your lungs.',
    aboveRangeMeaning:
      'Values near 95%–100% represent typical healthy oxygen saturation.',
    belowRangeMeaning:
      'Lower SpO2 readings can occur with respiratory illness, asthma, chronic lung conditions, high altitude, or poor sensor reading from cold fingers or nail polish.',
    balancedTakeaway:
      'If an SpO2 measurement was taken by pulse oximetry, cold hands or movement can cause artificially low readings, so clinicians confirm unexpected drops.',
    doctorQuestions: [
      'Is this oxygen saturation reading consistent with my breathing and heart rate?',
    ],
    rangeVariationNote:
      'Expected targets can differ for individuals living at high altitude or managing chronic lung conditions.',
    urgentGuidanceNote:
      'Oxygen saturation below 90%—or any drop paired with shortness of breath, bluish lips, or chest pain—requires urgent medical care.',
  },
  {
    id: 'bmi',
    canonicalName: 'Body Mass Index',
    abbreviation: 'BMI',
    panel: 'Anthropometric Measurements',
    aliases: ['bmi', 'body mass index'],
    expectedUnits: ['kg/m2', 'kg/m^2'],
    whatItMeasures:
      'Body Mass Index is a screening calculation derived from weight divided by height squared.',
    whyItMatters:
      'Clinicians use BMI as a general population-level screening index alongside waist circumference, blood pressure, lipids, and glucose.',
    aboveRangeMeaning:
      'A higher BMI can reflect higher body fat stores, or in athletic individuals, greater lean muscle mass.',
    belowRangeMeaning:
      'A lower BMI can reflect naturally lean build, nutritional shortfalls, or unintended weight loss.',
    balancedTakeaway:
      'BMI does not distinguish between muscle and fat mass or show fat distribution. Clinicians interpret it alongside metabolic lab tests and overall fitness.',
    doctorQuestions: [
      'How does my BMI fit alongside my metabolic panel, lipids, and blood pressure?',
    ],
    rangeVariationNote:
      'Standard BMI cutoffs can vary for athletes, older adults, children/adolescents, and specific ethnic populations.',
    urgentGuidanceNote:
      'Discuss unintended weight changes with a qualified healthcare professional.',
  },
];

/**
 * Find matching test definition by test name string.
 * Returns { definition, matchScore } or null.
 */
export function findTestDefinition(rawTestName) {
  if (!rawTestName || typeof rawTestName !== 'string') return null;

  const cleaned = rawTestName
    .toLowerCase()
    .replace(/[^a-z0-9\s\-\/().]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return null;

  for (const def of TEST_DEFINITIONS) {
    if (def.canonicalName.toLowerCase() === cleaned) {
      return { definition: def, matchScore: 1 };
    }
    if (def.abbreviation && def.abbreviation.toLowerCase() === cleaned) {
      return { definition: def, matchScore: 1 };
    }
    for (const alias of def.aliases) {
      if (alias.toLowerCase() === cleaned) {
        return { definition: def, matchScore: 1 };
      }
    }
  }

  let bestMatch = null;
  let bestLength = 0;

  for (const def of TEST_DEFINITIONS) {
    for (const alias of def.aliases) {
      const escaped = alias.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\s|\\()${escaped}($|\\s|\\)|,)`, 'i');
      if (regex.test(cleaned) && alias.length > bestLength) {
        bestLength = alias.length;
        bestMatch = { definition: def, matchScore: 0.85 };
      }
    }
  }

  return bestMatch;
}
