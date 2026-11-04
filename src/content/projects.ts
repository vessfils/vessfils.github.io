import type { Project } from './types'

/*
 * Project content. Every figure in this file comes from one of:
 *  - the project repository (code, saved weights, logs) — re-run locally where stated;
 *  - the PICTURE IA internship report and seminar deck (internal evaluation figures).
 * To add a project, append an object; cards, archive and case-study pages are generated from it.
 */

export const projects: Project[] = [
  // ───────────────────────────────────────── PICTURE IA
  {
    slug: 'picture-ia',
    index: '01',
    title: 'PICTURE IA',
    tagline: 'Multi-camera truck re-identification for waste-conformity control',
    summary:
      'An industrial computer vision pipeline that finds, among thousands of site-camera frames, the images of the truck an operator is checking — so they can inspect what it unloaded.',
    categories: ['Computer Vision', 'Deep Learning'],
    context: 'Professional',
    period: 'Mar – Sep 2026 · Veolia DEST',
    role: 'Computer vision intern — re-identification research, evaluation, pile-localisation prototype',
    status: 'Research in progress',
    stack: ['Python', 'Deep Learning', 'PyTorch', 'DINOv3', 'CLIP', 'ViT', 'Triplet loss', 'Optuna', 'OpenCV'],
    featured: true,
    cover: { visual: 'picture-pipeline' },
    source: { public: false, note: 'Internal Veolia project: code and site images cannot be published, so the figures here are diagrams drawn to explain the method.' },
    facts: [
      { label: 'Team', value: 'Scientific Computing & Modelling (CSM), DEST' },
      { label: 'Data', value: '4 sites · 10 working days · 1,510 truck images · 196 identities' },
      { label: 'Recognition', value: 'Veolia Poster Trophy 2026 — 3rd Jury Prize' },
    ],
    sections: {
      context: [
        {
          type: 'text',
          body: [
            'Veolia’s waste-reception sites must check that every incoming load conforms to what was declared. Picture already moved that check off the ground — operators no longer stand next to moving trucks — but they still review the photos at J+1, scrolling through frames one by one to find the unloading shot. That search takes roughly half of their time.',
            'The goal of Picture IA is to remove the search: given the image of a truck taken at the weighbridge, return the site-camera images of that same truck, and eventually outline the pile it dropped.',
          ],
        },
        {
          type: 'list',
          title: 'Constraints that shaped the approach',
          items: [
            '**One frame every two minutes.** There is no video and therefore no trajectory to track. Every detection has to be re-identified independently.',
            '**Heterogeneous sites.** Layouts and camera positions differ everywhere. A model that only works on the sites it was trained on is useless.',
            '**Look-alike fleets.** Different hauliers run the same cab, skip and colour. Meanwhile the same truck looks completely different from the entrance camera and from above while unloading.',
            '**Few identities.** The dataset has 196 distinct trucks. For re-identification, what limits learning is the number of identities, not the number of images.',
          ],
        },
      ],
      approach: [
        {
          type: 'text',
          body: [
            'The problem is framed as metric learning: map every truck crop to an embedding where images of the same truck are close and different trucks are far apart, then rank candidates by distance. Visual similarity is combined with temporal proximity and camera context, because neither signal is reliable alone.',
          ],
        },
        { type: 'visual', id: 'picture-workflows', caption: 'The three workflows of the target system. Detection runs continuously; re-identification is queried on demand; pile localisation is in development.' },
        {
          type: 'list',
          title: 'What I worked on',
          items: [
            '**Embedding benchmark.** Compared a fine-tuned ViT-S/16, CLIP ViT-L/14 and DINOv2 ViT-L/14 on all image pairs, split by identity (intra/inter) and by camera type (entrance, unloading, mixed). Mixed pairs are the real use case.',
            '**Fine-tuning DINOv3.** Restructured the training and evaluation code so each experiment is a configuration file. Then ran single-variable ablations on backbone freezing, embedding size, learning rate, triplet margin and augmentation, with Optuna for broader searches.',
            '**Triplet mining.** Implemented random, hard and semi-hard negative selection, and made the anchor type configurable. Using the unloading image as anchor points training at the operational question.',
            '**Evaluation.** Rank-1 with and without a temporal constraint, plus entrance-to-unloading matching, so that the reported metrics follow the operator’s workflow.',
            '**Data quality.** Wrote a COCO-annotation analysis script and reviewed a new 18-day annotation campaign for tracking-ID and box errors. A tracking error teaches the model that two trucks are one.',
          ],
        },
      ],
      architecture: [
        { type: 'visual', id: 'picture-pipeline', wide: true, caption: 'Pipeline overview (illustrative). Crops from the detector are embedded, filtered by time window and camera context, then ranked by distance.' },
        { type: 'visual', id: 'picture-triplet', caption: 'Triplet loss with margin. Semi-hard negatives — correctly ordered but inside the margin — gave the best results.' },
      ],
      highlights: [
        {
          type: 'highlight',
          title: 'Choosing the extractor by what pretraining keeps',
          body: [
            'CLIP learned to describe images in words. It recognises “a truck” but not “this truck”: its intra and inter distance distributions overlap almost entirely. DINOv3 is self-supervised on 1.7 billion images and keeps the structural detail that separates two vehicles, such as a logo, a beacon or a tarpaulin roller. At equal fine-tuning, DINOv3 led the ViT baseline by 11.6 points.',
          ],
        },
        {
          type: 'highlight',
          title: 'How far to fine-tune',
          body: [
            'With fewer than 200 identities, retraining the whole backbone memorised them; freezing it entirely never adapted to the sites. Unfreezing only the last three transformer blocks, with AdamW and a trained projection head, was the compromise. It added about eight points of Rank-1 over the alternatives.',
          ],
        },
        {
          type: 'highlight',
          title: 'The augmentation result I did not expect',
          body: [
            'Every augmentation I tested made results worse: flips, blur and random crops cost between 1.5 and 3.8 points of Rank-1. In re-identification the signal *is* the detail, and cropping or blurring removes exactly what the model must learn. Augmentations should imitate variation observed on site — weather, light, dirt, partial occlusion — rather than arbitrary geometric transforms.',
          ],
        },
        {
          type: 'highlight',
          title: 'An interpretable baseline for pile localisation',
          body: [
            'To outline the unloaded material I deliberately started without a learned model. Pick the camera where the truck appears most and find the run of frames where its box barely moves. Then compare before and after: ECC alignment, CLAHE on the LAB L channel, and a weighted LAB difference map. Otsu thresholding with a floor, morphology, and component selection by area and distance to the truck follow. It is fast, needs no training, and when it fails you can see which step failed.',
          ],
          code: {
            lang: 'python',
            file: 'change detection — scoring (excerpt, rewritten for illustration)',
            code: `diff = 0.40 * diff_l + 0.30 * diff_a + 0.30 * diff_b   # LAB channels
diff = cv2.GaussianBlur(normalize(diff), (7, 7), 0)

otsu, _ = cv2.threshold(diff, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
mask = diff >= max(int(otsu), MIN_DIFFERENCE)          # floor avoids tiny changes

# keep the component that is large and close to the truck's rear
score = area / (1.0 + distance_to_expected_drop_point)`,
          },
        },
      ],
      visuals: [
        { type: 'visual', id: 'picture-change', caption: 'Change-detection stages (illustrative schematic — no site imagery is published).' },
        {
          type: 'callout',
          tone: 'note',
          title: 'About the visuals',
          body: 'Site images, crops and model outputs belong to Veolia and are not published here. Every figure on this page is an original diagram or a chart of figures from the internship report and seminar.',
        },
      ],
      results: [
        {
          type: 'metrics',
          items: [
            { value: '84.0%', label: 'Entrance match', note: 'Finding the truck on site from its entrance image' },
            { value: '83.9%', label: 'mAP', note: 'Mean average precision over ranked candidates' },
            { value: '9 / 10', label: 'Trucks detected', note: 'Detection stage' },
          ],
          footnote: 'Figures as presented at the Veolia data science seminar, September 2026. Internal evaluation on 4 sites, 10 working days and 196 identities.',
        },
        { type: 'visual', id: 'picture-ablation', caption: 'Rank-1 with temporal constraint on the internal test set, changing one parameter at a time from the reference DINOv3 configuration.' },
        { type: 'visual', id: 'picture-augment', caption: 'Change in Rank-1 relative to no augmentation.' },
        {
          type: 'callout',
          tone: 'caveat',
          title: 'Read these numbers with their scope',
          body: 'Four sites, ten days, 196 identities. These figures carry real uncertainty on sites the model has not seen. The next step was to use 20 newly annotated days, first as an untouched test set and then for training.',
        },
      ],
      challenges: [
        {
          type: 'list',
          items: [
            '**Near-identical vehicles.** Some errors are trucks that genuinely look the same. With 196 identities there is not enough coverage to separate them reliably. That is a data-quantity limit as much as a model limit.',
            '**Background in the boxes.** 10 to 15% of detection boxes include a significant amount of background. It flows into the crop and the embedding and degrades the signature. Detection quality propagates straight into re-identification quality.',
            '**No single threshold.** Per camera, intra and inter distances separate, but at a different operating point for each viewpoint. A global distance threshold cannot work. Calibration has to be per site or per camera, or the decision has to rely on ranking.',
            '**Normalisation mismatch.** The original pipeline applied no input normalisation. DINOv3 and the AugReg ViT expect different statistics, and getting this wrong silently degrades embeddings.',
          ],
        },
      ],
      lessons: [
        {
          type: 'list',
          items: [
            'Triplet construction weighs as much as the choice of backbone, so mining statistics should be instrumented during training.',
            'Domain rules (time windows, camera geometry) and the visual signal are complementary. Neither is sufficient alone.',
            'Changing one parameter at a time made results explainable to non-specialists — useful when presenting to operators, a seminar audience and the Poster Trophy jury.',
          ],
        },
      ],
    },
    related: ['leaffliction', 'multilayer-perceptron', 'learn2slither'],
  },

  // ───────────────────────────────────────── LEAFFLICTION
  {
    slug: 'leaffliction',
    index: '02',
    title: 'Leaffliction',
    tagline: 'Plant-disease classification, from image analysis to a trained CNN',
    summary:
      'A four-stage computer vision project on apple and grape leaves: dataset analysis, PlantCV feature extraction, augmentation-based class balancing, and a PyTorch CNN that reaches 97.2% on a held-out test split.',
    categories: ['Computer Vision', 'Deep Learning'],
    context: 'École 42',
    period: '2025 – 2026',
    role: 'Sole author',
    status: 'Complete',
    stack: ['Python', 'PyTorch', 'torchvision', 'PlantCV', 'OpenCV', 'Albumentations', 'Matplotlib'],
    featured: true,
    interactive: true,
    cover: { visual: 'leaf-predictions' },
    source: { public: false, note: 'Repository is private — source available on request.' },
    facts: [
      { label: 'Classes', value: '8 (4 apple, 4 grape)' },
      { label: 'Images', value: '7,221 raw · 10,496 after balancing' },
      { label: 'Test accuracy', value: '97.2% on 723 held-out images' },
    ],
    sections: {
      context: [
        {
          type: 'text',
          body: [
            'The dataset contains 7,221 photographs of apple and grape leaves across eight classes: healthy leaves and seven diseases such as black rot, rust, scab and esca. It is heavily imbalanced: 1,640 healthy apple leaves against 275 with apple rust.',
            'The project is split into four programs, each usable on its own: a distribution analysis, an image-transformation tool, an augmentation tool, and a train/predict pipeline.',
          ],
        },
        { type: 'visual', id: 'leaf-distribution', caption: 'Raw class distribution — the imbalance that the augmentation step corrects.' },
      ],
      approach: [
        { type: 'visual', id: 'leaf-pipeline', wide: true, caption: 'From raw images to prediction.' },
        {
          type: 'list',
          items: [
            '**Split first, augment second.** The data is split 80 / 10 / 10 per class before any augmentation, so no augmented copy of a test image can leak into training.',
            '**Balance by augmentation.** Each training class is topped up to the size of the largest one, 1,312 images, with Albumentations transforms: blur, flip, rotation, perspective skew, grid distortion and random-resized crop.',
            '**Small CNN, trained from scratch.** Three convolution / ReLU / max-pool blocks (32 → 64 → 64 channels) on 128×128 inputs, then a 512-unit dense layer. Adam (lr 1e-3, weight decay 1e-4), up to 20 epochs.',
            '**Checkpoint on validation.** The best validation epoch is kept, and early stopping with a patience of 4 ends unproductive runs.',
          ],
        },
      ],
      architecture: [{ type: 'visual', id: 'leaf-cnn', wide: true, caption: 'Network as implemented in Train.py: 4.3 M parameters, most of them in the first dense layer.' }],
      highlights: [
        {
          type: 'highlight',
          title: 'Leaf segmentation without a model',
          body: [
            'The transformation step isolates the leaf with colour-space thresholds rather than a learned mask. Saturation from HSV is combined with the a* and b* channels from LAB, then cleaned by hole filling and dilation. The largest contour gives the region of interest, and PlantCV computes shape analysis, pseudo-landmarks and colour histograms on the masked leaf.',
          ],
          code: {
            lang: 'python',
            file: 'srcs/Transformation.py — Apply_mask (condensed)',
            code: `s = pcv.rgb2gray_hsv(rgb_img=self.img, channel="s")
s_thresh = pcv.threshold.binary(gray_img=s, threshold=60, object_type="light")
b = pcv.rgb2gray_lab(rgb_img=self.img, channel='b')      # blue–yellow
b_thresh = pcv.threshold.binary(gray_img=b, threshold=125, object_type='light')
a = pcv.rgb2gray_lab(rgb_img=self.img, channel='a')      # green–magenta
a_thresh = pcv.threshold.binary(gray_img=a, threshold=113, object_type='dark')

sba = pcv.logical_or(bin_img1=pcv.logical_or(bin_img1=s_thresh, bin_img2=b_thresh), bin_img2=a_thresh)
sba_fill1 = pcv.fill(bin_img=sba, size=15)
sba_fill2 = pcv.dilate(gray_img=sba_fill1, ksize=3, i=3)
sba_fill3 = pcv.fill(bin_img=sba_fill2, size=250)`,
          },
        },
        {
          type: 'highlight',
          title: 'A single CLI for the whole pipeline',
          body: [
            '`Train.py` exposes `split`, `train`, `test` and `run` sub-commands. The saved checkpoint stores the class names alongside the weights, so prediction never depends on directory ordering.',
          ],
        },
      ],
      visuals: [
        {
          type: 'figure',
          layout: 'grid-4',
          caption: 'Real outputs of the transformation program on an Apple scab test image: original, Gaussian-blurred saturation mask, masked leaf and region of interest.',
          images: [
            { src: 'leaffliction/original', alt: 'Original apple leaf with scab lesions' },
            { src: 'leaffliction/blur', alt: 'Binary saturation mask after Gaussian blur' },
            { src: 'leaffliction/mask', alt: 'Leaf isolated on a white background by the combined mask' },
            { src: 'leaffliction/roi', alt: 'Leaf highlighted with its bounding rectangle' },
          ],
        },
        {
          type: 'figure',
          layout: 'grid-3',
          caption: 'PlantCV shape analysis, pseudo-landmarks along the leaf outline and midrib, and colour-channel histogram of the masked leaf.',
          images: [
            { src: 'leaffliction/analyze_object', alt: 'PlantCV size analysis overlay on the leaf' },
            { src: 'leaffliction/pseudolandmarks', alt: 'Pseudo-landmark points along leaf edges and centre line' },
            { src: 'leaffliction/histogram', alt: 'Colour channel histogram of the leaf pixels' },
          ],
        },
        { type: 'visual', id: 'leaf-predictions', wide: true, caption: 'Twelve random test images with the saved model’s top-3 softmax probabilities. Generated by loading leaf_cnn.pth and running it on the test split.' },
      ],
      results: [
        {
          type: 'metrics',
          items: [
            { value: '97.2%', label: 'Test accuracy', note: '703 / 723 held-out images' },
            { value: '8', label: 'Classes', note: 'Two species, seven diseases' },
            { value: '128²', label: 'Input size', note: 'RGB, normalised to [-1, 1]' },
          ],
          footnote: 'Re-evaluated for this page by loading the saved checkpoint and running it on the repository’s test split.',
        },
        { type: 'visual', id: 'leaf-confusion', caption: 'Confusion matrix on the test split. Most errors stay within a species, e.g. grape black rot confused with grape esca.' },
      ],
      challenges: [
        {
          type: 'list',
          items: [
            '**Imbalance versus leakage.** Balancing before splitting would have inflated test accuracy with augmented copies of training images. Splitting first made the result honest at the cost of a more complex pipeline.',
            '**Colour thresholds are dataset-specific.** The HSV/LAB thresholds work on these uniformly lit photos. They would need retuning, or a learned mask, for field images.',
            '**Grape black rot is the hardest class** (111 / 118 correct), with confusions towards apple healthy and grape esca. That points to texture cues a deeper network or higher resolution would capture better.',
          ],
        },
      ],
      lessons: [
        {
          type: 'list',
          items: [
            'Classical image processing and deep learning complement each other: PlantCV for interpretable features, a CNN for the decision.',
            'A good evaluation protocol matters as much as the model, and the split-then-augment order is the detail that makes the 97% believable.',
          ],
        },
      ],
    },
    related: ['picture-ia', 'multilayer-perceptron', 'dslr'],
  },

  // ───────────────────────────────────────── LEARN2SLITHER
  {
    slug: 'learn2slither',
    index: '03',
    title: 'Learn2Slither',
    tagline: 'A Snake agent trained with deep Q-learning',
    summary:
      'A reinforcement learning agent that learns Snake on a 10×10 board from a 15-value view of its surroundings. Over 200 evaluation games it reaches an average maximum length of 25.7, against 4.1 for the same network untrained.',
    categories: ['Reinforcement Learning', 'Machine Learning'],
    context: 'École 42',
    period: '2026',
    role: 'Sole author',
    status: 'Complete',
    stack: ['Python', 'PyTorch', 'Pygame', 'NumPy', 'Matplotlib'],
    featured: true,
    cover: { visual: 'snake-gameplay' },
    source: { public: false, note: 'Repository is private — source available on request.' },
    facts: [
      { label: 'Board', value: '10 × 10 · 2 green apples · 1 red apple' },
      { label: 'Training', value: '10,000 games' },
      { label: 'Mean max length', value: '25.7 (best 43) over 200 games' },
    ],
    sections: {
      context: [
        {
          type: 'text',
          body: [
            'The snake starts with length 3 on a 10×10 board containing two green apples, which grow it, and one red apple, which shrinks it. The agent may only use what the snake can “see” from its head in four directions — no global view of the board.',
            'The project went through two versions. The first used a tabular Q-table. The final version, presented here, replaces the table with a neural network trained by deep Q-learning with experience replay.',
          ],
        },
      ],
      approach: [
        { type: 'visual', id: 'snake-loop', caption: 'The reinforcement learning loop as implemented.' },
        {
          type: 'list',
          title: 'Design decisions',
          items: [
            '**Relative actions.** The network chooses straight, turn right or turn left — never a reversal — which removes a whole class of suicidal moves and makes the policy direction-invariant.',
            '**Compact state.** 15 values: normalised distance to the nearest obstacle in three directions, a one-hot current heading, and line-of-sight visibility of green and red apples in four directions.',
            '**Reward shaping.** −100 for death or for looping too long (more than 100 × length steps), +10 per green apple, plus a milestone bonus every 10 segments, and −10 per red apple. Each step without eating costs a growing penalty, offset by ±0.5 for moving towards or away from the nearest green apple.',
            '**Training.** Network 15 → 64 → 64 → 3, MSE on Bellman targets, Adam (lr 1e-3), γ = 0.9, replay memory of 100,000 transitions sampled in batches of 1,024, and ε decayed linearly from 1 to 0.001 over the first 4,000 games.',
          ],
        },
      ],
      architecture: [{ type: 'visual', id: 'snake-state', wide: true, caption: 'What the agent observes and how it decides.' }],
      highlights: [
        {
          type: 'highlight',
          title: 'Bellman targets on replayed batches',
          body: [
            'Each transition is learned twice: once immediately (short memory) and again when a random batch is replayed after each game (long memory). Replay breaks the correlation between consecutive steps that otherwise makes Q-learning unstable.',
          ],
          code: {
            lang: 'python',
            file: 'srcs2/model.py — QTrainer.train_step (condensed)',
            code: `pred = self.model(state)                 # Q(s, ·) for the batch
target = pred.clone()
for idx in range(len(done)):
    q_new = reward[idx]
    if not done[idx]:
        q_new = reward[idx] + self.gamma * torch.max(self.model(next_state[idx])).detach()
    target[idx][torch.argmax(action[idx]).item()] = q_new

self.optimzer.zero_grad()
loss = self.criterion(target, pred)      # MSE on the taken action only
loss.backward()
self.optimzer.step()`,
          },
        },
        {
          type: 'highlight',
          title: 'An experiment that did not ship: flood-fill features',
          body: [
            'The agent’s main failure is trapping itself in its own body. I added three BFS features — the fraction of free cells reachable after each possible move — giving an 18-value state. The code is in the repository, but the evaluated model is the 15-feature one, and I did not complete a comparable training run with BFS.',
          ],
        },
      ],
      visuals: [
        { type: 'visual', id: 'snake-gameplay', wide: true, caption: 'Genuine captures: the saved model played with ε = 0 while the project’s Pygame renderer drew each frame (run headless for this page). It is a recording, not inference in your browser.' },
      ],
      results: [
        {
          type: 'metrics',
          items: [
            { value: '25.7', label: 'Mean max length', note: 'Trained agent, 200 games' },
            { value: '43', label: 'Best game', note: 'Longest snake reached' },
            { value: '4.1', label: 'Untrained baseline', note: 'Same network, random weights' },
          ],
          footnote: 'Evaluated for this page with the saved weights (10000_model_sansBFS.pth) and the matching code version, greedy policy, seed 42.',
        },
        { type: 'visual', id: 'snake-hist', caption: 'Distribution of the maximum length reached per game, trained versus untrained.' },
      ],
      challenges: [
        {
          type: 'list',
          items: [
            '**Self-trapping.** With only local line-of-sight information, the agent cannot know that a corridor is closed. This caps performance around 25–45 segments on a 100-cell board.',
            '**No target network.** Bootstrapping from the network being trained can overestimate Q-values. A target network is scaffolded in the code but disabled; enabling it is the obvious next step.',
            '**Reward shaping trade-offs.** The distance-to-apple bonus speeds up learning, but if it is too strong the agent chases food into dead ends.',
          ],
        },
      ],
      lessons: [
        {
          type: 'list',
          items: [
            'In reinforcement learning, the state representation sets the ceiling. The network can only be as good as what it is allowed to see.',
            'Debugging RL means watching several signals at once — loss, score, mean Q-value — and I kept a table in the README for interpreting their combinations.',
          ],
        },
      ],
    },
    related: ['multilayer-perceptron', 'picture-ia', 'leaffliction'],
  },

  // ───────────────────────────────────────── KFS
  {
    slug: 'kernel-from-scratch',
    index: '04',
    title: 'Kernel From Scratch',
    tagline: 'KFS-1 & KFS-2 — a 32-bit x86 kernel booted in QEMU',
    summary:
      'A protected-mode kernel written in C and NASM: Multiboot entry, VGA text driver, PS/2 keyboard, interrupt handling through a remapped PIC, a GDT placed at 0x800 and a small shell with two virtual terminals.',
    categories: ['Systems'],
    context: 'École 42 · Team of 2',
    period: 'Nov 2025 – Jan 2026',
    role: 'Built with a partner (boot banner: “Jcampagn and Abrisse”)',
    status: 'Complete',
    stack: ['C', 'NASM', 'x86 (i386)', 'GNU ld', 'GRUB / Multiboot', 'QEMU'],
    featured: true,
    cover: { image: { src: 'kfs/kfs2_gdt', alt: 'QEMU window showing the kernel shell printing the GDT entries' } },
    source: { public: false, note: 'Repositories are private — source available on request.' },
    facts: [
      { label: 'Size', value: '≈ 2,300 lines of C and assembly' },
      { label: 'Binary', value: '16 KB flat kernel loaded at 1 MB' },
      { label: 'Toolchain', value: 'x86_64-elf-gcc -m32, NASM, QEMU' },
    ],
    sections: {
      context: [
        {
          type: 'text',
          body: [
            'Kernel From Scratch is a series of 42 projects in which you write an operating system kernel with no standard library and no runtime underneath. The first two steps are covered here, and the two repositories share most of their code.',
          ],
        },
        {
          type: 'table',
          head: ['Step', 'Scope'],
          rows: [
            ['KFS-1', 'Boot through GRUB / Multiboot, assembly entry point and stack, linker script, VGA text output with colours, printk, keyboard input, multiple screens (bonus).'],
            ['KFS-2', 'A Global Descriptor Table at 0x00000800 with kernel and user code, data and stack segments; a tool to print the kernel stack; a minimal shell (help, echo, stack, gdt, ticks, color, clear, halt).'],
          ],
        },
      ],
      approach: [
        { type: 'visual', id: 'kfs-boot', wide: true, caption: 'From power-on to the shell prompt.' },
        {
          type: 'text',
          body: [
            'The interrupt scaffolding (IDT installation, ISR and IRQ stubs) follows the classic structure of Bran’s kernel development tutorial, which we used as a reference. Our work is the KFS-specific part around it: the GDT layout at a fixed address, the stack and GDT inspection tools, the VGA terminal with per-screen buffers, keyboard-driven terminal switching and the shell.',
          ],
        },
      ],
      architecture: [
        { type: 'visual', id: 'kfs-memory', caption: 'Physical memory layout used by the kernel.' },
        { type: 'visual', id: 'kfs-interrupts', caption: 'Path of a keystroke from the keyboard controller to the shell.' },
      ],
      highlights: [
        {
          type: 'highlight',
          title: 'Remapping the PIC',
          body: [
            'At boot the 8259 PIC delivers hardware interrupts on vectors 8–15, which collide with CPU exceptions. The kernel reprograms both controllers so IRQ 0–15 land on vectors 32–47, then acknowledges each interrupt with an end-of-interrupt — to the slave controller as well when the IRQ came from it.',
          ],
          code: {
            lang: 'c',
            file: 'srcs/irq.c (comments condensed)',
            code: `void irq_handler(struct regs *r)
{
    void (*handler)(struct regs *r) = irq_routines[r->int_no - 32];
    if (handler)
        handler(r);
    if (r->int_no >= 40)        /* IRQ 8–15 came through the slave PIC */
        outportb(0xA0, 0x20);   /* EOI to slave  */
    outportb(0x20, 0x20);       /* EOI to master */
}`,
          },
        },
        {
          type: 'highlight',
          title: 'A GDT at a fixed physical address',
          body: [
            'KFS-2 requires the GDT at 0x800 rather than wherever the compiler puts a global array. The table is written through a pointer cast to that address. It holds seven flat descriptors — null, kernel code/data/stack, user code/data/stack — and is loaded with `lgdt` before the segment registers are reloaded by a far jump. The `gdt` command reads the descriptors back from memory. Entry 2 shows access byte 0x93 instead of the 0x92 that was written, because the CPU set the accessed bit when the data segment was loaded.',
          ],
          code: {
            lang: 'c',
            file: 'srcs/gdt.c',
            code: `#define GDT_ADDR 0x00000800
struct gdt_entry *gdt = (struct gdt_entry *)GDT_ADDR;

gdt_set_gate(0, 0, 0, 0, 0);                    /* null            */
gdt_set_gate(1, 0, 0xFFFFFFFF, 0x9A, 0xCF);     /* kernel code     */
gdt_set_gate(2, 0, 0xFFFFFFFF, 0x92, 0xCF);     /* kernel data     */
gdt_set_gate(3, 0, 0xFFFFFFFF, 0x92, 0xCF);     /* kernel stack    */
gdt_set_gate(4, 0, 0xFFFFFFFF, 0xFA, 0xCF);     /* user code, DPL3 */
gdt_set_gate(5, 0, 0xFFFFFFFF, 0xF2, 0xCF);     /* user data       */
gdt_set_gate(6, 0, 0xFFFFFFFF, 0xF2, 0xCF);     /* user stack      */
gdt_flush();                                    /* lgdt + far jump */`,
          },
        },
        {
          type: 'highlight',
          title: 'Virtual terminals by copying video memory',
          body: [
            'Each terminal keeps its own 80×25 buffer. Pressing F1 or F2 saves the current contents of VGA memory at 0xB8000 into the active buffer and copies the target buffer back. It is simple, needs no allocator, and fits the constraints of a kernel without paging.',
          ],
        },
      ],
      visuals: [
        {
          type: 'figure',
          layout: 'single',
          caption: 'KFS-1 boot screen in QEMU: the banner and the colour cycling of the VGA driver.',
          images: [{ src: 'kfs/kfs1_boot', alt: 'Kernel boot screen with ASCII 42 logo, authors and a multicoloured welcome line' }],
        },
        {
          type: 'figure',
          layout: 'grid-2',
          caption: 'KFS-2 shell: built-in help, then the GDT read back from 0x800, then the kernel stack pointer and the top of the stack.',
          images: [
            { src: 'kfs/kfs2_gdt', alt: 'Shell output of help and gdt commands listing seven descriptors' },
            { src: 'kfs/kfs2_stack', alt: 'Shell output of the stack command showing esp and stack words' },
          ],
        },
        {
          type: 'figure',
          layout: 'grid-2',
          caption: 'F2 switches to a second terminal with its own colour and history (left); F1 restores the first one intact (right). The PIT tick counter is read by the ticks command.',
          images: [
            { src: 'kfs/kfs2_tty2', alt: 'Second terminal in cyan showing echo and ticks commands' },
            { src: 'kfs/kfs2_tty1_restored', alt: 'First terminal restored with its previous help output' },
          ],
        },
        {
          type: 'callout',
          tone: 'note',
          body: 'All screenshots were captured for this page by building the repositories and booting them in QEMU (screendump via the QEMU monitor). The doubled “0x0x” prefix in the gdt output is a real formatting bug in our printk usage — left as is.',
        },
      ],
      results: [
        {
          type: 'list',
          items: [
            'Both kernels build with a cross-compiler on macOS and boot directly in QEMU (`qemu-system-i386 -kernel`) or from a GRUB ISO.',
            'Keyboard input, the timer, terminal switching and all shell commands work as shown above.',
            'Not in scope yet: paging, a memory allocator, user-mode processes. Those are the next KFS steps.',
          ],
        },
      ],
      challenges: [
        {
          type: 'list',
          items: [
            '**Toolchain on macOS.** Apple’s toolchain cannot produce freestanding 32-bit ELF objects, so the Makefile switches to a cross-compiler, x86_64-elf-gcc in -m32 mode, with -ffreestanding -nostdlib -fno-pic.',
            '**No safety net.** A wrong descriptor or an unacknowledged interrupt does not raise an error. The machine faults, reboots or simply stops receiving keystrokes, so each change had to be small and checked in the emulator.',
            '**The bottom line of the terminal.** Adding terminals introduced a bug on the last screen row (the commit log reads “tty added but last-line bug”), fixed in the following commit. Scrolling and cursor handling at the edge of the 80×25 buffer are where most of the screen bugs lived.',
          ],
        },
      ],
      lessons: [
        {
          type: 'list',
          items: [
            'Writing a kernel makes everything above it concrete. Segmentation, interrupt vectors, calling conventions and memory-mapped I/O stop being abstractions.',
            'Working in a pair on code with no safety net taught us to make every change small and testable in the emulator.',
          ],
        },
      ],
    },
    related: ['cloud-1', 'matcha', 'learn2slither'],
  },

  // ───────────────────────────────────────── MATCHA
  {
    slug: 'matcha',
    index: '05',
    title: 'Matcha',
    tagline: 'A full-stack dating application in TypeScript',
    summary:
      'A two-person web application with React 19, Express 5, PostgreSQL and Socket.IO. I built the account flows, interactions (likes, visits, blocks, reports), geocoding and the discovery search with distance and shared-interest ranking.',
    categories: ['Full-Stack'],
    context: 'École 42 · Team of 2',
    period: 'Dec 2025 – Sep 2026',
    role: 'Backend and frontend features — see contribution breakdown',
    status: 'Complete',
    stack: ['TypeScript', 'React 19', 'Vite', 'TanStack Query', 'Express 5', 'PostgreSQL', 'Socket.IO', 'Zod', 'Vitest', 'Docker'],
    featured: true,
    cover: { image: { src: 'matcha/discover-map', alt: 'Matcha discovery map: profile clusters around Paris on a street map' } },
    source: { public: false, note: 'Repository is private — source available on request.' },
    facts: [
      { label: 'Team', value: '2 engineers' },
      { label: 'Database', value: '21 tables over 12 SQL migrations' },
      { label: 'Tests', value: '157 test files (Vitest, Supertest)' },
    ],
    sections: {
      context: [
        {
          type: 'text',
          body: [
            'Matcha is the 42 web project in which you build a dating site without a full-stack framework: you write your own SQL, your own validation and your own real-time layer. Users register and verify their email, complete a profile with photos, interests and location, then browse and search other profiles, like them, match, chat and receive notifications.',
            'We built it as a pnpm monorepo of three workspaces: an Express API, a React single-page app, and a shared API-contract package of Zod schemas that both sides compile against.',
          ],
        },
      ],
      approach: [
        {
          type: 'list',
          title: 'My contributions',
          intro: 'This was a team of two, and my teammate authored most of the commits, including the overall architecture, chat and real-time layer. Based on the commit history, my part was:',
          items: [
            '**Authentication flows** — login, JWT access and refresh tokens with hashed refresh storage, logout, email verification and password reset.',
            '**User and profile endpoints** — profile retrieval and update, profile visits, likes and the first fame-rating computation.',
            '**Safety features** — blocking (database table and API) and user reports.',
            '**Geolocation** — reverse and forward geocoding of the user’s position, with schema validation of coordinates.',
            '**Discovery and search backend** — the filtered, paginated search query with Haversine distance and shared-interest counts.',
            '**Frontend pages** — notifications, activity history (likes and visits), discovery filters and the interest selector.',
          ],
        },
      ],
      architecture: [
        { type: 'visual', id: 'matcha-architecture', wide: true, caption: 'Workspaces and runtime components.' },
        { type: 'visual', id: 'matcha-schema', wide: true, caption: 'Main relations of the PostgreSQL schema (21 tables; lookup tables omitted).' },
      ],
      highlights: [
        {
          type: 'highlight',
          title: 'Ranking candidates in a single SQL pass',
          body: [
            'Discovery has to filter and sort by distance, age, popularity and shared interests, and then paginate. Doing this in application code would mean loading every profile. Instead, the query computes great-circle distance with the Haversine formula and counts shared tags with a correlated subquery. Filtering and sorting happen in the database, with `LIMIT` / `OFFSET` for pagination.',
          ],
          code: {
            lang: 'sql',
            file: 'backend/src/modules/discovery/discovery.repo.ts (excerpt)',
            code: `6371 * 2 * ASIN(SQRT(
    POWER(SIN(RADIANS((p.location_lat - r.location_lat) / 2)), 2)
  + COS(RADIANS(r.location_lat)) * COS(RADIANS(p.location_lat))
  * POWER(SIN(RADIANS((p.location_lng - r.location_lng) / 2)), 2)
)) AS location_distance,

( SELECT COUNT(DISTINCT requester_tags.tag_id)::int
  FROM user_tags requester_tags
  JOIN user_tags candidate_tags
    ON candidate_tags.tag_id = requester_tags.tag_id
   AND candidate_tags.user_id = u.id
  WHERE requester_tags.user_id = $1 ) AS common_tags_count`,
          },
        },
        {
          type: 'highlight',
          title: 'Precomputed popularity',
          body: [
            'The fame rating is stored on the profile rather than computed at read time, because discovery sorts hundreds of profiles by it. The trade-off is that every event that influences it — a like, a visit, a report, a photo — must trigger a refresh. I wrote the first version inside the like and visit services; it was later extracted into its own module.',
          ],
        },
        {
          type: 'highlight',
          title: 'Refresh tokens that can be revoked',
          body: [
            'Access tokens are short-lived JWTs. Refresh tokens are stored hashed server-side and sent as http-only cookies, so a leaked database row cannot be replayed and logout really ends the session.',
          ],
        },
      ],
      visuals: [
        {
          type: 'figure',
          layout: 'single',
          caption: 'Discovery: suggested profiles ranked by distance, shared interests and fame rating, with the filter panel on the left.',
          images: [{ src: 'matcha/discover', alt: 'Discover page with a grid of suggested profiles and a filter sidebar' }],
        },
        {
          type: 'figure',
          layout: 'grid-2',
          caption: 'Left: the same suggestions on a map, clustered by area. Right: search with a 15 km maximum distance — the Haversine query at work.',
          images: [
            { src: 'matcha/discover-map', alt: 'Map view with profile markers and clusters around Paris' },
            { src: 'matcha/search-filtered', alt: 'Search results filtered to profiles within 15 km' },
          ],
        },
        {
          type: 'figure',
          layout: 'grid-2',
          caption: 'A public profile with like, report and block actions, and the activity centre listing visits and likes.',
          images: [
            { src: 'matcha/profile', alt: 'Public profile page with details, fame rating and actions' },
            { src: 'matcha/notifications', alt: 'Notifications page listing profile visits and likes' },
          ],
        },
        {
          type: 'figure',
          layout: 'single',
          caption: 'Real-time chat between two matched users (Socket.IO), with read receipts.',
          images: [{ src: 'matcha/conversation', alt: 'Chat conversation between two matched users' }],
        },
        {
          type: 'figure',
          layout: 'grid-3',
          caption: 'The same screens on a phone: discovery, chat and notifications.',
          images: [
            { src: 'matcha/mobile-discover', alt: 'Discover page on a phone' },
            { src: 'matcha/mobile-conversation', alt: 'Chat on a phone' },
            { src: 'matcha/mobile-notifications', alt: 'Notifications on a phone' },
          ],
        },
        {
          type: 'callout',
          tone: 'note',
          body: 'Screenshots taken from a local instance filled by the project’s own seed script: 550 synthetic profiles with generated names, initial-based avatars and fake `.seed` email addresses. No real user appears.',
        },
      ],
      results: [
        {
          type: 'list',
          items: [
            'Complete feature set: registration with email verification, OAuth, profiles with photos and interests, discovery and search, likes and matches, real-time chat, notifications, blocking and reporting.',
            'Runs locally with Docker Compose (PostgreSQL 16, Mailpit) and a seeding script that generates demo profiles.',
            '157 test files across backend and frontend, plus linting and Prettier enforced at the workspace level.',
          ],
        },
      ],
      challenges: [
        {
          type: 'list',
          items: [
            '**Working on a shared codebase.** My early modules were later refactored into a stricter module structure. Adapting my code to evolving conventions — and reviewing the changes — was the main collaboration lesson.',
            '**Location privacy.** Exact coordinates must never reach other users, so the application exposes distances and deliberately approximated positions (the fuzzing module itself was written by my teammate).',
            '**Consistency of derived data.** Precomputed values like the fame rating are fast to read but easy to let drift. Every write path that affects them must be covered.',
          ],
        },
      ],
      lessons: [
        {
          type: 'list',
          items: [
            'A typed contract shared between client and server catches whole categories of integration bugs at compile time.',
            'Writing SQL by hand forced me to think about indexes, pagination and what the database should compute.',
          ],
        },
      ],
    },
    related: ['cloud-1', 'kernel-from-scratch', 'picture-ia'],
  },

  // ───────────────────────────────────────── MLP
  {
    slug: 'multilayer-perceptron',
    index: '06',
    title: 'Multilayer Perceptron',
    tagline: 'A neural network written with NumPy only',
    summary:
      'Forward pass, backpropagation, softmax cross-entropy, L2 regularisation, learning-rate decay and early stopping — implemented by hand to classify breast-tumour biopsies. The saved model scores 95.8% on held-out data.',
    categories: ['Machine Learning', 'Deep Learning'],
    context: 'École 42',
    period: 'Oct – Nov 2025',
    role: 'Sole author',
    status: 'Complete',
    stack: ['Python', 'NumPy', 'pandas', 'Matplotlib'],
    featured: true,
    cover: { image: { src: 'mlp/training', alt: 'Training plots drawn by mlp.py: loss, accuracy and PCA decision boundary', fit: 'contain' } },
    source: { public: false, note: 'Repository is private — source available on request.' },
    facts: [
      { label: 'Dataset', value: 'Wisconsin Diagnostic Breast Cancer · 30 features' },
      { label: 'Split', value: '426 train / 141 test' },
      { label: 'Test accuracy', value: '95.8% (saved model)' },
    ],
    sections: {
      context: [
        {
          type: 'text',
          body: [
            'The task is binary — benign or malignant — from 30 numerical features describing cell nuclei. The constraint is that no ML library may do the learning: every matrix operation of training is written explicitly with NumPy.',
          ],
        },
      ],
      approach: [
        {
          type: 'list',
          items: [
            '**Initialisation.** He-normal weights (scaled by √(2/nᵢₙ)), suited to ReLU layers; zero biases.',
            '**Forward pass.** ReLU hidden layers and a numerically stable softmax output (logits shifted by their maximum).',
            '**Loss.** Cross-entropy plus an L2 penalty on the weights.',
            '**Optimisation.** Full-batch gradient descent with time-based decay, αₜ = α / √(1 + 0.01·t).',
            '**Early stopping.** Training stops when test loss has not improved by more than 1e-4 for 100 consecutive evaluations.',
            '**Reproducibility.** Seeded splits and initialisation; standardisation statistics are saved alongside the weights.',
          ],
        },
      ],
      architecture: [
        {
          type: 'table',
          head: ['Layer', 'Units', 'Activation', 'Weights'],
          rows: [
            ['Input', '30', '—', 'standardised features'],
            ['Hidden 1', '64', 'ReLU', 'W1: 64 × 30'],
            ['Hidden 2', '32', 'ReLU', 'W2: 32 × 64'],
            ['Hidden 3', '16', 'ReLU', 'W3: 16 × 32'],
            ['Hidden 4', '8', 'ReLU', 'W4: 8 × 16'],
            ['Output', '2', 'softmax', 'W5: 2 × 8'],
          ],
          caption: 'Default configuration (`--layers 64 32 16 8`). Depth and width are command-line options.',
        },
      ],
      highlights: [
        {
          type: 'highlight',
          title: 'Backpropagation in a loop over layers',
          body: [
            'With softmax and cross-entropy, the output gradient simplifies to A − Y. The loop then walks backwards, computing weight and bias gradients from the previous activations and propagating through the ReLU derivative. It works for any number of layers.',
          ],
          code: {
            lang: 'python',
            file: 'srcs/mlp.py',
            code: `A_final = activations['A' + str(C)]
dZ = A_final - y  # softmax + cross-entropy
for c in reversed(range(1, C + 1)):
    A_prev = activations['A' + str(c - 1)]
    gradients['dW' + str(c)] = 1 / m * np.dot(dZ, A_prev.T)
    gradients['db' + str(c)] = 1 / m * np.sum(dZ, axis=1, keepdims=True)
    if c > 1:
        W = parametres['W' + str(c)]
        da_prev = np.dot(W.T, dZ)
        Z_prev = activations['Z' + str(c - 1)]
        dZ = da_prev * relu_derivative(Z_prev)`,
          },
        },
      ],
      visuals: [
        {
          type: 'figure',
          layout: 'single',
          caption: 'The figure mlp.py draws at the end of training (seed 42): loss, accuracy, and the decision boundary projected onto two principal components. The x-axis counts logging steps of 10 iterations.',
          images: [{ src: 'mlp/training', alt: 'Loss and accuracy curves and a PCA decision boundary separating benign and malignant samples' }],
        },
      ],
      results: [
        {
          type: 'metrics',
          items: [
            { value: '95.8%', label: 'Test accuracy', note: 'Saved model on 141 held-out samples' },
            { value: '19', label: 'Configurations compared', note: 'Depth, width and learning rate' },
            { value: '3,300', label: 'Iterations', note: 'Early stop, seeded retrain' },
          ],
          footnote: 'The saved model was re-evaluated for this page. A seeded retrain stopped early at iteration 3,300 with 95.1% accuracy and F1 0.925.',
        },
        { type: 'visual', id: 'mlp-grid', caption: 'Final test accuracy of each configuration from the repository’s training-history files. Differences of one or two samples on a 141-sample test set are within noise.' },
        {
          type: 'figure',
          layout: 'single',
          caption: 'The comparison plot from draw_historic.py: test loss and accuracy of every configuration I trained.',
          images: [{ src: 'mlp/history', alt: 'Test loss and test accuracy curves for nineteen network configurations' }],
        },
      ],
      challenges: [
        {
          type: 'list',
          items: [
            '**Small test set.** With 141 samples, one misclassification moves accuracy by 0.7 points, so the grid-search ranking is mostly noise. I report the saved model rather than the best-looking configuration.',
            '**Overfitting deeper networks.** Train loss falls to 0.02 while test loss levels off around 0.14. Early stopping and L2 regularisation limit the damage, but a small network does as well here.',
          ],
        },
      ],
      lessons: [
        {
          type: 'list',
          items: [
            'Deriving and coding backpropagation by hand is what made PyTorch’s autograd feel transparent in later projects.',
            'On small tabular data, model capacity matters less than evaluation discipline.',
          ],
        },
      ],
    },
    related: ['dslr', 'ft-linear-regression', 'leaffliction'],
  },

  // ───────────────────────────────────────── DSLR
  {
    slug: 'dslr',
    index: '07',
    title: 'DSLR',
    tagline: 'Statistics and one-vs-all logistic regression from scratch',
    summary:
      'Exploratory analysis with hand-written statistics, feature selection from histograms and scatter plots, and a four-class logistic regression trained by gradient descent — 99.0% accuracy on the test set.',
    categories: ['Machine Learning'],
    context: 'École 42',
    period: 'Jul – Sep 2025',
    role: 'Sole author',
    status: 'Complete',
    stack: ['Python', 'NumPy', 'pandas', 'Matplotlib'],
    featured: false,
    interactive: true,
    cover: { visual: 'dslr-scatter' },
    source: { public: false, note: 'Repository is private — source available on request.' },
    facts: [
      { label: 'Data', value: '1,600 students · 13 course scores' },
      { label: 'Model', value: '4 logistic regressions (one-vs-all)' },
      { label: 'Test accuracy', value: '99.0% on 400 students' },
    ],
    sections: {
      context: [
        {
          type: 'text',
          body: [
            'A playful dataset — students sorted into four Hogwarts houses — used to practise a serious workflow: describe the data, decide which features matter, then implement a multi-class classifier without any ML library.',
          ],
        },
      ],
      approach: [
        {
          type: 'list',
          items: [
            '**describe.py** re-implements count, mean, standard deviation, min/max and quartiles, plus variance, coefficient of variation, IQR and skewness, without using pandas’ statistics.',
            '**histogram.py** finds the course whose score distribution is the most homogeneous across houses. Such a feature cannot discriminate.',
            '**scatter_plot.py** finds the two features that carry the same information.',
            '**logreg_train.py** standardises four selected features and trains one sigmoid classifier per house by gradient descent with learning-rate decay. Prediction picks the house with the highest probability.',
          ],
        },
      ],
      architecture: [{ type: 'visual', id: 'dslr-ova', caption: 'One-vs-all: four binary classifiers, one decision.' }],
      visuals: [
        { type: 'visual', id: 'dslr-hist', wide: true, caption: 'Score distributions per house, computed from the training set. Care of Magical Creatures overlaps almost completely; Herbology and Charms separate the houses.' },
        { type: 'visual', id: 'dslr-scatter', wide: true, caption: 'Left: Astronomy and Defense Against the Dark Arts are perfectly anti-correlated (r = −1.00), so only one is kept. Right: Herbology against Charms already separates the four houses.' },
      ],
      results: [
        {
          type: 'metrics',
          items: [
            { value: '99.0%', label: 'Test accuracy', note: 'Against the provided ground truth' },
            { value: '4', label: 'Features kept', note: 'Charms, Herbology, Divination, History of Magic' },
            { value: '10k', label: 'Iterations', note: 'Per classifier, lr 0.01 with decay' },
          ],
          footnote: 'Re-run for this page: trained on dataset_train.csv, then predicted on dataset_test.csv and compared with dataset_truth.csv.',
        },
      ],
      challenges: [
        {
          type: 'list',
          items: [
            '**Missing values.** Rows with a missing score in any of the selected features are dropped before training.',
            '**Feature scale.** Scores range from about −1,000 to 100,000 depending on the course. Without standardisation, gradient descent diverges or stalls.',
          ],
        },
      ],
      lessons: [{ type: 'list', items: ['Good feature selection from simple plots beats adding model complexity: four features are enough for 99%.'] }],
    },
    related: ['multilayer-perceptron', 'ft-linear-regression', 'leaffliction'],
  },

  // ───────────────────────────────────────── LINEAR REGRESSION
  {
    slug: 'ft-linear-regression',
    index: '08',
    title: 'ft_linear_regression',
    tagline: 'Gradient descent on a single feature, made visible',
    summary:
      'The first machine learning project of the 42 track: predict a car’s price from its mileage with a linear model trained by batch gradient descent. Includes an interactive version that runs the same algorithm in your browser.',
    categories: ['Machine Learning'],
    context: 'École 42',
    period: 'Apr 2025',
    role: 'Sole author',
    status: 'Complete',
    stack: ['Python', 'NumPy', 'pandas', 'Matplotlib'],
    featured: false,
    interactive: true,
    cover: { visual: 'linreg-demo' },
    source: { public: false, note: 'Repository is private — source available on request.' },
    facts: [
      { label: 'Data', value: '24 cars · mileage → price' },
      { label: 'Model', value: 'price = θ₁ · km_norm + θ₀' },
      { label: 'Learned', value: 'θ₁ = −4,656 · θ₀ = 8,008' },
    ],
    sections: {
      context: [
        {
          type: 'text',
          body: [
            'A deliberately small problem used to understand the mechanics of learning: one feature, two parameters, a cost function and the update rule. It is foundational — included here because the interactive version is a clear way to show what gradient descent does.',
          ],
        },
      ],
      approach: [
        {
          type: 'list',
          items: [
            'Mileage is min–max normalised, otherwise gradients for θ₁ are several orders of magnitude larger than for θ₀.',
            'Both parameters are updated simultaneously from the mean-squared-error gradients over the whole dataset.',
            '`train.py` saves θ₀, θ₁ and the normalisation bounds; `predict.py` reads them and applies the same normalisation to the input mileage.',
          ],
        },
      ],
      visuals: [
        { type: 'visual', id: 'linreg-demo', wide: true, caption: 'Live demo: the same update rule as train.py, running on the project’s 24 data points. Adjust the learning rate and step through training.' },
      ],
      highlights: [
        {
          type: 'highlight',
          title: 'The whole learning algorithm',
          body: ['Two derivatives and two updates. Everything in later projects is an elaboration of these lines.'],
          code: {
            lang: 'python',
            file: 'srcs/train.py',
            code: `for i in range(epochs):
    Y_pred = m * X + c
    D_m = (-2 / n) * sum(X * (Y - Y_pred))   # ∂MSE/∂θ₁
    D_c = (-2 / n) * sum(Y - Y_pred)         # ∂MSE/∂θ₀
    m = m - L * D_m
    c = c - L * D_c`,
          },
        },
      ],
      results: [
        {
          type: 'list',
          items: [
            'Trained parameters (from `values.txt`): θ₁ = −4,656.26 and θ₀ = 8,008.32 on normalised mileage. In plain terms, a new car is valued at about €8,000 and the 240,000 km car at about €3,350.',
            'The original run uses a learning rate of 1e-4 for one million iterations. The demo uses larger rates so convergence is visible in seconds.',
          ],
        },
      ],
      lessons: [{ type: 'list', items: ['Feature scaling is not a detail: it decides whether gradient descent converges at all.'] }],
    },
    related: ['dslr', 'multilayer-perceptron'],
  },

  // ───────────────────────────────────────── CLOUD-1
  {
    slug: 'cloud-1',
    index: '09',
    title: 'Cloud-1',
    tagline: 'Automated deployment of a containerised WordPress stack with Ansible',
    summary:
      'An Ansible playbook that turns fresh Ubuntu cloud instances into a running WordPress site behind Nginx and HTTPS, with Docker Compose, persistent volumes and Ansible Vault for secrets.',
    categories: ['Infrastructure'],
    context: 'École 42',
    period: 'Sep – Oct 2025',
    role: 'Sole author',
    status: 'Complete',
    stack: ['Ansible', 'Ansible Vault', 'Docker', 'Docker Compose', 'Nginx', 'MariaDB', 'WordPress', 'AWS EC2', 'Ubuntu'],
    featured: false,
    cover: { visual: 'cloud-architecture' },
    source: { public: false, note: 'Repository is private — source available on request.' },
    facts: [
      { label: 'Targets', value: '2 Ubuntu instances (AWS)' },
      { label: 'Roles', value: 'docker · setup_cloud · deploy_docker · cleanup_docker' },
      { label: 'Secrets', value: 'Ansible Vault (group_vars, .env template)' },
    ],
    sections: {
      context: [
        {
          type: 'text',
          body: [
            'Cloud-1 extends Inception — a WordPress stack split across containers — from a local machine to remote servers. The requirement is full automation: a single command must provision any number of fresh instances identically, and the site must survive reboots without losing data.',
          ],
        },
      ],
      approach: [
        { type: 'visual', id: 'cloud-pipeline', wide: true, caption: 'What one playbook run does on each host.' },
        {
          type: 'list',
          items: [
            '**docker role** — installs Docker Engine and the Compose plugin from Docker’s official apt repository, then enables the service.',
            '**setup_cloud role** — creates the project tree and bind-mounted data directories, renders `.env` from a Jinja template with vaulted variables, copies the Compose file, Nginx configuration and WordPress image sources, and generates a TLS certificate.',
            '**deploy_docker role** — starts the stack with `community.docker.docker_compose_v2`.',
            '**cleanup.yml** — tears everything down: containers, images, volumes, network and project directory.',
          ],
        },
      ],
      architecture: [{ type: 'visual', id: 'cloud-architecture', wide: true, caption: 'Runtime topology on each instance. Only Nginx publishes ports.' }],
      highlights: [
        {
          type: 'highlight',
          title: 'One entry point, encrypted everywhere else',
          body: [
            'Nginx is the only container that publishes ports. Port 80 redirects to 443, PHP requests go to WordPress over FastCGI, and phpMyAdmin is reverse-proxied under a sub-path. MariaDB is reachable only on the internal bridge network.',
          ],
          code: {
            lang: 'nginx',
            file: 'default.conf (excerpt)',
            code: `server { listen 80; return 301 https://$host$request_uri; }

server {
    listen 443 ssl;
    ssl_certificate     /etc/nginx/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/nginx/certs/nginx-selfsigned.key;

    location ~ \\.php$ {
        fastcgi_pass wordpress:9000;
        include fastcgi_params;
    }
}`,
          },
        },
        {
          type: 'highlight',
          title: 'Idempotent provisioning',
          body: [
            'Each task describes a state, not an action. Re-running the playbook on a configured host changes nothing. Certificate generation uses `creates:` so an existing certificate is never overwritten.',
          ],
        },
      ],
      results: [
        {
          type: 'list',
          items: [
            'The playbook deployed the stack to two instances in parallel from a single command.',
            'Database and site files live on bind-mounted host directories and survive container recreation.',
            'The certificate is self-signed. A production setup would use Let’s Encrypt, which is prepared but commented out in the Compose file.',
          ],
        },
      ],
      challenges: [
        {
          type: 'list',
          items: [
            '**Secret handling.** Credentials moved from a plain `.env` to a template filled from Ansible Vault during the project. In hindsight I would have started with Vault from the first commit.',
            '**Ordering.** WordPress must wait for the database, and Nginx for WordPress. `depends_on` only orders container start-up, so the WordPress setup script loops on `wp db check` until MariaDB answers.',
          ],
        },
      ],
      lessons: [{ type: 'list', items: ['Infrastructure as code is as much about tearing down cleanly as about deploying.'] }],
    },
    related: ['kernel-from-scratch', 'matcha'],
  },

  // ───────────────────────────────────────── FT_IRC
  {
    slug: 'ft-irc',
    index: '10',
    title: 'ft_irc',
    tagline: 'An IRC server in C++98 with a single poll() loop',
    summary:
      'A non-blocking IRC server that real clients can connect to: authentication, channels, private messages and channel-operator commands. I wrote the command parser and the operator commands (KICK, INVITE, TOPIC, PART).',
    categories: ['Networking', 'Systems'],
    context: 'École 42 · Team project',
    period: 'Aug – Oct 2023',
    role: 'Command parsing and channel-operator commands',
    status: 'Complete',
    stack: ['C++98', 'POSIX sockets', 'poll()', 'IRC protocol (RFC 1459/2812)'],
    featured: false,
    cover: { visual: 'irc-terminal' },
    source: { public: false, note: 'Repository is private — source available on request.' },
    facts: [
      { label: 'Size', value: '≈ 3,200 lines of C++' },
      { label: 'Commands', value: '16 handlers (PASS … WHOIS)' },
      { label: 'I/O model', value: 'One thread, one poll() over all sockets' },
    ],
    sections: {
      context: [
        {
          type: 'text',
          body: [
            'The subject: write an IRC server in C++98 that a standard client can use, without threads and without blocking. Every socket goes through a single `poll()` call, and a slow client must never stall the others.',
          ],
        },
      ],
      approach: [
        {
          type: 'list',
          title: 'My contributions',
          intro: 'The server core and the poll loop were written by my teammate. My part, according to the commit history and git blame:',
          items: [
            '**CommandParser** — splits raw input into IRC messages (prefix, command, parameters, trailing) and builds the matching command object.',
            '**Channel-operator commands** — KICK, INVITE and TOPIC with their permission checks, plus PART and QUIT.',
            '**Error handling** — the exception hierarchy that turns each failure into the right numeric reply (403 no such channel, 441 user not in channel, 482 not channel operator…).',
            '**NICK validation** — rejecting invalid characters and nicknames already in use.',
          ],
        },
      ],
      architecture: [{ type: 'visual', id: 'irc-architecture', wide: true, caption: 'From a byte on a socket to a reply sent to every channel member.' }],
      highlights: [
        {
          type: 'highlight',
          title: 'Errors as typed exceptions',
          body: [
            'Each command validates its preconditions in order — channel exists, sender is in it, sender is operator, target is in it — and throws a typed exception. The server catches it and sends the corresponding numeric reply. Command handlers stay linear, and every error path produces a protocol-correct answer.',
          ],
          code: {
            lang: 'cpp',
            file: 'srcs/packet/received/KickCommand.cpp (condensed)',
            code: `Channel &channel = server.getChannel(_channel);
if (channel.isAlreadyIn(user) == false)
    throw UserNotInChannelExec("KICK", server.getHost(), user.getNickname(), _channel, AClientPacket::getClientFd());
if (channel.isOperator(user) == true)
{
    User &userKick = server.getUser(_userKicked);
    if (channel.isAlreadyIn(userKick) == false)
        throw UserNotInChannelException("KICK", server.getHost(), user.getNickname(), _userKicked, _channel, AClientPacket::getClientFd());
    server.sendToChannel(_channel, client, "KICK", _channel + " " + _userKicked + " :" + _reason, -1);
    channel.suppressUser(userKick);
}
else
    throw NoOperatorPermision(user.getNickname(), channel.getName());   // → 482`,
          },
        },
      ],
      visuals: [
        { type: 'visual', id: 'irc-terminal', wide: true, caption: 'Real session recorded for this page: the server built from the repository, two scripted clients on localhost. Bob’s KICK is refused with 482; Alice, the channel operator, can kick.' },
      ],
      results: [
        {
          type: 'list',
          items: [
            'Registration with password, nicknames, channels with operators, topics, invitations, private and channel messages, KICK, PART, QUIT and PING.',
            'The session above was replayed against a fresh build of the repository for this page, with every reply recorded verbatim.',
          ],
        },
      ],
      challenges: [
        {
          type: 'list',
          items: [
            '**Message framing.** TCP does not preserve message boundaries, so a read can contain several IRC messages — or half of one. Every command has to be parsed from a byte stream, not from a single `recv()`.',
            '**Specification details.** Small protocol details, such as the optional trailing parameter of PART and TOPIC or the exact numeric reply for each failure, took several rounds of corrections (visible in the commit log).',
          ],
        },
      ],
      lessons: [{ type: 'list', items: ['Event-driven I/O and explicit error paths are what make a network service robust, more than the business logic.'] }],
    },
    related: ['minishell', 'matcha', 'kernel-from-scratch'],
  },

  // ───────────────────────────────────────── MINISHELL
  {
    slug: 'minishell',
    index: '11',
    title: 'Minishell',
    tagline: 'A Bash-like shell in C: tokens, quotes, pipes and redirections',
    summary:
      'A POSIX-style interactive shell written in C with readline: tokenizer, quote and variable expansion, syntax tree, pipes, redirections, here-documents, signals and seven builtins. Built in a pair; I worked on the builtins and the parsing.',
    categories: ['Systems'],
    context: 'École 42 · Team of 2',
    period: 'May – Sep 2022',
    role: 'Builtins, parsing and tokenizer, environment handling',
    status: 'Complete',
    stack: ['C', 'readline', 'POSIX (fork, execve, pipe, dup2)', 'Make'],
    featured: false,
    cover: { visual: 'minishell-terminal' },
    source: { public: false, note: 'Repository is private — source available on request.' },
    facts: [
      { label: 'Builtins', value: 'echo · cd · pwd · export · unset · env · exit' },
      { label: 'Size', value: '≈ 2,000 lines of C (plus libft)' },
      { label: 'Team', value: '2 students' },
    ],
    sections: {
      context: [
        {
          type: 'text',
          body: [
            'Minishell is where 42 students find out how much a shell does between pressing Enter and seeing output. The program must reproduce Bash behaviour for quoting, expansion, pipes, redirections, here-documents, exit statuses and Ctrl-C / Ctrl-\\ — with only a handful of authorised system calls.',
          ],
        },
      ],
      approach: [
        { type: 'visual', id: 'minishell-pipeline', wide: true, caption: 'Stages from the input line to running processes.' },
        {
          type: 'list',
          title: 'My contributions',
          intro: 'Work was split between two students. From the commit history, mine was:',
          items: [
            '**Builtins** — echo with -n, cd, pwd, export, unset, env and exit, including their exit statuses and error messages.',
            '**Parsing** — quote handling, variable expansion (including `$?`), whitespace removal and syntax checks.',
            '**Tokenizer** — splitting the line into words and operators and concatenating adjacent quoted fragments.',
            '**Environment** — building the shell’s own copy of the environment at start-up.',
          ],
        },
      ],
      visuals: [
        { type: 'visual', id: 'minishell-terminal', wide: true, caption: 'Real session recorded for this page by building the repository and driving it through a pseudo-terminal.' },
      ],
      highlights: [
        {
          type: 'highlight',
          title: 'Quotes change meaning, not just grouping',
          body: [
            'Double quotes keep spaces together but still expand variables. Single quotes suppress everything. Adjacent fragments such as `"$USER"\'s\'` form a single word. The tokenizer tags each fragment with its quoting context, then expansion and concatenation run afterwards. Splitting on spaces first and fixing quotes later does not work.',
          ],
        },
      ],
      results: [
        {
          type: 'list',
          items: [
            'Interactive prompt with history, pipelines of any length, `<`, `>`, `>>` and `<<` redirections, environment variables and `$?`.',
            'Ctrl-C prints a fresh prompt without exiting; Ctrl-\\ is ignored at the prompt, as in Bash.',
          ],
        },
      ],
      challenges: [
        {
          type: 'list',
          items: [
            '**File descriptors.** Every pipe end left open in the wrong process keeps a pipeline waiting forever, so each child must close every descriptor it does not use after `dup2`.',
            '**Memory.** The subject requires no leaks from our own code. A valgrind suppression file isolates readline’s known allocations so real leaks stay visible.',
          ],
        },
      ],
      lessons: [{ type: 'list', items: ['Parsing is design work: the token representation decides how hard every later stage will be.'] }],
    },
    related: ['ft-irc', 'kernel-from-scratch', 'so-long'],
  },

  // ───────────────────────────────────────── CUB3D
  {
    slug: 'cub3d',
    index: '12',
    title: 'CUB3D',
    tagline: 'A ray-casting 3D engine in C, from a 2D map',
    summary:
      'A first-person maze renderer in the style of early-90s shooters, written in C on top of MiniLibX: it reads a 2D map, casts one ray per screen column and draws textured walls, with doors, a minimap and a ray overlay. Built in a pair; I wrote most of the ray casting and the map parsing.',
    categories: ['Graphics'],
    context: 'École 42 · Team of 2',
    period: 'Dec 2022 – Apr 2023',
    role: 'Ray casting, map parsing and validation, minimap, input handling',
    status: 'Complete',
    stack: ['C', 'MiniLibX (X11)', 'Ray casting', 'Trigonometry', 'Make'],
    featured: false,
    cover: { visual: 'cub3d-gameplay' },
    source: { public: false, note: 'Repository is private — source available on request.' },
    facts: [
      { label: 'Resolution', value: '720 × 720, one ray per column' },
      { label: 'Field of view', value: '60°' },
      { label: 'Extras', value: 'Doors (E), minimap (M), ray overlay (L)' },
    ],
    sections: {
      context: [
        {
          type: 'text',
          body: [
            'The program reads a `.cub` file — four wall textures, floor and ceiling colours, and a grid of walls, empty cells, doors and the player’s start — and lets you walk through it in first person. There is no 3D library: every pixel of the view comes from casting rays through a 2D grid and turning distances into wall heights.',
          ],
        },
      ],
      approach: [
        { type: 'visual', id: 'cub3d-pipeline', wide: true, caption: 'What happens for each frame.' },
        {
          type: 'list',
          title: 'Who did what',
          intro: 'A two-person project. From the commit history and git blame:',
          items: [
            '**My part** — the ray casting (`ray.c` and the horizontal / vertical intersection functions), the `.cub` parser and map validation, the minimap with its ray overlay, and keyboard handling.',
            '**My teammate’s part** — the textured wall rendering (`render.c`), the game loop and player movement, plus fixes at the end of the project.',
          ],
        },
      ],
      highlights: [
        {
          type: 'highlight',
          title: 'Two grid walks per ray instead of small steps',
          body: [
            'Instead of advancing a ray pixel by pixel, the caster jumps from one grid line to the next. One walk visits only horizontal grid lines and the other only vertical ones, each with a constant step derived from the ray angle. The nearer of the two hits is the wall, and which one won tells the renderer whether the face is north/south or east/west — that is what selects the texture.',
          ],
          code: {
            lang: 'c',
            file: 'srcs/castrays/check_horiz_ray.c — init_horizontal_cast',
            code: `intercept->y = floorf(info->player.coord.y / TILE_SIZE) * TILE_SIZE;
if (ray->is_ray_facing_down == TRUE)
    intercept->y += TILE_SIZE;
intercept->x = info->player.coord.x
    + (intercept->y - info->player.coord.y) / tanf(ray->ray_angle);
step->y = TILE_SIZE;
if (ray->is_ray_facing_up)
    step->y *= -1;
step->x = TILE_SIZE / tanf(ray->ray_angle);`,
          },
        },
        {
          type: 'highlight',
          title: 'Spacing rays on the screen, not in angle',
          body: [
            'The first version added a constant angle between rays, which slightly stretches walls near the edges of the view. The final version computes each ray from its screen column through the projection plane with `atan`, so columns are evenly spaced on screen. The commented-out first version is still in the file.',
          ],
          code: {
            lang: 'c',
            file: 'srcs/castrays/ray.c — update_rays',
            code: `distance_projection_plane = (WIN_X / 2) / tanf(info->fov_angle / 2);
while (++i < info->num_rays)
{
    ray_angle = info->player.rotation_angle + atanf((i - info->num_rays / 2)
            / distance_projection_plane);
    info->rays[i] = init_ray(ray_angle);
    cast_ray(info, info->rays + i);
}`,
          },
        },
      ],
      visuals: [
        { type: 'visual', id: 'cub3d-gameplay', wide: true, caption: 'Genuine output of the project’s code. The game targets the Linux MiniLibX, so for this page it was compiled unchanged against a small headless stand-in that saves each frame instead of opening a window; key presses were replayed through the game’s own handlers.' },
      ],
      results: [
        {
          type: 'list',
          items: [
            'Smooth first-person movement and rotation, four directional textures, doors that open with E, a minimap with the cast rays.',
            'The parser rejects open maps, unknown characters, missing or duplicated start positions and missing textures, each with its own error message.',
          ],
        },
      ],
      challenges: [
        {
          type: 'list',
          items: [
            '**Fish-eye distortion.** Raw ray distances make walls bulge in the centre of the view. The renderer multiplies each distance by the cosine of the angle between the ray and the view direction.',
            '**Edge cases in the map.** A map that is open at its border, or has a `0` at the end of a line, must not let a ray escape the grid. Several of the last commits are about exactly these cases.',
          ],
        },
      ],
      lessons: [{ type: 'list', items: ['A good intermediate representation (the ray: angle, hit point, distance, which side was hit) cleanly separates geometry from drawing.'] }],
    },
    related: ['so-long', 'kernel-from-scratch', 'minishell'],
  },

  // ───────────────────────────────────────── SO_LONG
  {
    slug: 'so-long',
    index: '13',
    title: 'so_long',
    tagline: 'A small 2D tile game with MiniLibX',
    summary:
      'A top-down game in C: a dinosaur collects every water drop before reaching the puddle. Maps are read from .ber files and validated; the bonus version adds sprite animation and an on-screen move counter.',
    categories: ['Graphics'],
    context: 'École 42',
    period: 'Feb 2022',
    role: 'Sole author',
    status: 'Complete',
    stack: ['C', 'MiniLibX (X11)', 'XPM sprites', 'get_next_line'],
    featured: false,
    cover: { image: { src: 'so-long/map4', alt: 'Desert tile map with a purple dinosaur, cacti walls, water drops and a puddle exit' } },
    source: { public: true, url: 'https://github.com/vessfils/So_long' },
    facts: [
      { label: 'Size', value: '≈ 900 lines of C' },
      { label: 'Tiles', value: '50 × 50 px XPM sprites' },
      { label: 'Maps', value: '7 playable, 9 deliberately invalid' },
    ],
    sections: {
      context: [
        {
          type: 'text',
          body: [
            'One of the first graphical projects of the 42 core curriculum: open a window, draw a tile map, handle keyboard events and keep the game state consistent. Everything is done in C with MiniLibX, a minimal wrapper around X11.',
          ],
        },
      ],
      approach: [
        {
          type: 'list',
          items: [
            '**Map loading** — the .ber file is read line by line with my get_next_line, then checked: non-empty, rectangular, closed by walls, exactly one player, at least one exit and one collectible. Each failure exits with its own error message.',
            '**Rendering** — sprites are loaded once as MiniLibX images and drawn tile by tile into the window.',
            '**Game rules** — walls block movement, drops are counted, the exit only ends the game once every drop is collected, and every move is counted.',
            '**Bonus** — a seven-frame player animation, animated collectibles and the move counter drawn in the window.',
          ],
        },
      ],
      visuals: [
        {
          type: 'figure',
          layout: 'single',
          caption: 'map3.ber rendered with the game’s own sprites (cactus walls, sand floor, dinosaur, drops, puddle exit). This is a render of the map file, not an in-game capture: the build targets Linux MiniLibX.',
          images: [{ src: 'so-long/map3', alt: 'Wide maze map of cacti with a dinosaur, drops and a puddle exit' }],
        },
      ],
      results: [
        {
          type: 'list',
          items: [
            'Playable mandatory and bonus versions. The repository ships playable test maps and deliberately invalid ones (unclosed, non-rectangular, missing elements…) to exercise the validator.',
          ],
        },
      ],
      lessons: [{ type: 'list', items: ['Validate input exhaustively at the boundary, and the rest of the program can trust its data.'] }],
    },
    related: ['minishell', 'kernel-from-scratch'],
  },
]

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)
export const featuredProjects = projects.filter((p) => p.featured)
export const allCategories = Array.from(new Set(projects.flatMap((p) => p.categories)))
