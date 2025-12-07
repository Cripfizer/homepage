<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\IconRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: IconRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['icon:read', 'icon:list']]
        ),
        new Get(
            normalizationContext: ['groups' => ['icon:read', 'icon:detail']],
            provider: \App\State\IconStateProvider::class
        ),
        new Post(
            normalizationContext: ['groups' => ['icon:read']],
            denormalizationContext: ['groups' => ['icon:write']],
            processor: \App\State\IconStateProcessor::class
        ),
        new Put(
            normalizationContext: ['groups' => ['icon:read']],
            denormalizationContext: ['groups' => ['icon:write']],
            provider: \App\State\IconStateProvider::class,
            processor: \App\State\IconStateProcessor::class
        ),
        new Delete(
            provider: \App\State\IconStateProvider::class,
            processor: \App\State\IconStateProcessor::class
        )
    ],
    paginationEnabled: false,
    security: "is_granted('ROLE_USER')"
)]
#[ApiFilter(SearchFilter::class, properties: ['parent' => 'exact'])]
class Icon
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['icon:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['icon:read', 'icon:write'])]
    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 50)]
    #[Groups(['icon:read', 'icon:write'])]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['link', 'folder'])]
    private ?string $type = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['icon:read', 'icon:write'])]
    #[Assert\Length(max: 255)]
    private ?string $imageUrl = null;

    #[ORM\Column(length: 7, nullable: true)]
    #[Groups(['icon:read', 'icon:write'])]
    #[Assert\Regex(pattern: '/^#[0-9A-Fa-f]{6}$/')]
    private ?string $backgroundColor = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(['icon:read', 'icon:write'])]
    #[Assert\Length(max: 500)]
    #[Assert\Url]
    private ?string $url = null;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    #[Groups(['icon:read', 'icon:write'])]
    private ?self $parent = null;

    /**
     * @var Collection<int, Icon>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parent', orphanRemoval: true)]
    #[Groups(['icon:detail'])]
    private Collection $children;

    #[ORM\Column]
    #[Groups(['icon:read', 'icon:write'])]
    #[Assert\NotNull]
    #[Assert\PositiveOrZero]
    private ?int $position = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'icons')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['icon:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['icon:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
        $this->children = new ArrayCollection();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }

    public function setImageUrl(?string $imageUrl): static
    {
        $this->imageUrl = $imageUrl;

        return $this;
    }

    public function getBackgroundColor(): ?string
    {
        return $this->backgroundColor;
    }

    public function setBackgroundColor(?string $backgroundColor): static
    {
        $this->backgroundColor = $backgroundColor;

        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(?string $url): static
    {
        $this->url = $url;

        return $this;
    }

    public function getParent(): ?self
    {
        return $this->parent;
    }

    public function setParent(?self $parent): static
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * @return Collection<int, Icon>
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    public function addChild(self $child): static
    {
        if (!$this->children->contains($child)) {
            $this->children->add($child);
            $child->setParent($this);
        }

        return $this;
    }

    public function removeChild(self $child): static
    {
        if ($this->children->removeElement($child)) {
            if ($child->getParent() === $this) {
                $child->setParent(null);
            }
        }

        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): static
    {
        $this->position = $position;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
